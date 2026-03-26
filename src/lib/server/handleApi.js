import { NextResponse } from "next/server";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import { OAuth2Client } from "google-auth-library";
import { v2 as cloudinary } from "cloudinary";
import { getUserPool, getPollPool, userDatabaseName, catalogDatabaseName } from "./db.js";
import { getBearerToken, verifyUserId } from "./auth.js";
import { formatProductRow } from "./productUtils.js";
import { sendInvoiceEmail, sendTelegramMessage } from "./notify.js";

function userDbName() {
  return userDatabaseName();
}
function pollDbName() {
  return catalogDatabaseName();
}
function splitDb() {
  const u = userDbName();
  const p = pollDbName();
  return Boolean(u && p && u !== p);
}
function tblUsers() {
  return splitDb() ? `\`${userDbName()}\`.users` : "users";
}
function tblProducts() {
  return splitDb() ? `\`${pollDbName()}\`.products` : "products";
}
function tblCustomerReviews() {
  return splitDb() ? `\`${pollDbName()}\`.customer_reviews` : "customer_reviews";
}
function tblPromoCodes() {
  return splitDb() ? `\`${pollDbName()}\`.promo_codes` : "promo_codes";
}

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

function getGoogleClient() {
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function handleApi(request, method, slug) {
  const parts = Array.isArray(slug) ? slug : [];
  const userPool = getUserPool();
  const pollPool = getPollPool();

  try {
    const head = parts[0];

    /* ---------------- auth ---------------- */
    if (head === "auth") {
      const a1 = parts[1];
      if (method === "POST" && a1 === "signup") {
        const { name, email, password } = await request.json();
        if (!name || !email || !password) {
          return json({ message: "All fields are required." }, 400);
        }
        const [existingUser] = await userPool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (existingUser.length > 0) {
          return json({ message: "This email already exists." }, 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await userPool.query(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [
          name,
          email,
          hashedPassword,
        ]);
        return json(
          {
            message: "Your account has been successfully created!",
            result: {
              fieldCount: result.fieldCount || 0,
              affectedRows: result.affectedRows || 0,
              insertId: result.insertId || null,
              info: result.info || "",
              serverStatus: result.serverStatus || 2,
              warningStatus: result.warningStatus || 0,
            },
          },
          201
        );
      }

      if (method === "POST" && a1 === "signin") {
        const { email, password } = await request.json();
        if (!email || !password) {
          return json({ message: "Email and password are required." }, 400);
        }
        const [rows] = await userPool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (rows.length < 1) {
          return json({ message: "Email or password is incorrect.", status: 401 }, 401);
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return json({ message: "Email or password is incorrect.", status: 401 }, 401);
        }
        const token = jwt.sign(
          { id: user.user_id },
          process.env.ACCESS_TOKEN_SECRET || "default_secret",
          { algorithm: "HS256", expiresIn: "1h" }
        );
        const [cartItems] = await userPool.query(`SELECT * FROM Cart WHERE user_id = ?`, [user.user_id]);
        return json({
          message: "You are logged in!",
          status: 200,
          token,
          user: { id: user.user_id, name: user.name, email: user.email },
          cartItems,
        });
      }

      if (method === "PATCH" && a1 === "change-password") {
        const { oldPassword, newPassword } = await request.json();
        const v = verifyUserId(request);
        if (v.error) return v.error;
        const userId = v.userId;
        if (!oldPassword || !newPassword) {
          return json({ message: "Both old and new passwords are required." }, 400);
        }
        const [rows] = await userPool.query(`SELECT password FROM users WHERE user_id = ?`, [userId]);
        if (rows.length < 1) return json({ message: "User not found." }, 404);
        const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
        if (!isMatch) return json({ message: "Old password is incorrect." }, 400);
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await userPool.query(`UPDATE users SET password = ? WHERE user_id = ?`, [hashedNewPassword, userId]);
        return json({ message: "Password updated successfully!" });
      }

      if (method === "POST" && a1 === "google-login") {
        const body = await request.json();
        const idToken = body.token;
        if (!idToken) return json({ message: "Google token is required." }, 400);
        const client = getGoogleClient();
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;
        const [userRows] = await userPool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        let user;
        if (userRows.length > 0) {
          user = userRows[0];
        } else {
          const hashedPassword = await bcrypt.hash(Date.now().toString(), 10);
          const [insertResult] = await userPool.query(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [
            name,
            email,
            hashedPassword,
          ]);
          const [newUserRows] = await userPool.query(`SELECT * FROM users WHERE user_id = ?`, [insertResult.insertId]);
          user = newUserRows[0];
        }
        const authToken = jwt.sign(
          { id: user.user_id },
          process.env.ACCESS_TOKEN_SECRET || "default_secret",
          { algorithm: "HS256", expiresIn: "1h" }
        );
        return json({
          message: "✅ Google login successful",
          token: authToken,
          user: { id: user.user_id, name: user.name, email: user.email },
        });
      }

      if (method === "GET" && a1 === "user" && parts[2] === "basic") {
        const token = getBearerToken(request);
        if (!token) return json({ success: false, message: "Unauthorized" }, 401);
        try {
          const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          const userId = decoded.id;
          const [rows] = await userPool.query(`SELECT user_id, name, email FROM users WHERE user_id = ?`, [userId]);
          if (rows.length === 0) {
            return json({ success: false, message: "User not found" }, 404);
          }
          return json({ success: true, data: rows[0] });
        } catch {
          return json({ success: false, message: "Internal server error" }, 500);
        }
      }
    }

    /* ---------------- user ---------------- */
    if (head === "user") {
      const v = verifyUserId(request);
      if (v.error) return v.error;
      const userId = v.userId;

      if (method === "GET" && parts.length === 1) {
        const [rows] = await userPool.query(`SELECT * FROM users WHERE user_id = ?`, [userId]);
        if (rows.length === 0) return json({ message: "User not found" }, 404);
        return json({ user: rows[0] });
      }

      if (method === "PUT" && parts[1] === "update") {
        const { name, email } = await request.json();
        await userPool.query(`UPDATE users SET name=?, email=? WHERE user_id=?`, [name, email, userId]);
        return json({ message: "User info updated successfully!" });
      }

      if (method === "POST" && parts[1] === "upload") {
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file || typeof file === "string") {
          return json({ error: "File not found" }, 400);
        }
        const buf = Buffer.from(await file.arrayBuffer());
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
          return json({ error: "Cloudinary not configured" }, 500);
        }
        configureCloudinary();
        const url = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: "avatars" }, (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          });
          stream.end(buf);
        });
        await userPool.query(`UPDATE users SET avatar=? WHERE user_id=?`, [url, userId]);
        return json({ message: "Avatar updated successfully!", image: url });
      }
    }

    /* ---------------- reviews ---------------- */
    if (head === "reviews") {
      if (method === "GET" && parts.length === 1) {
        const [rows] = await pollPool.query(`SELECT * FROM customer_reviews`);
        if (rows.length === 0) return json({ message: "No reviews found" }, 404);
        return json({ status: 200, reviews: rows });
      }
      if (method === "POST" && parts[1] === "create") {
        const { product_id, rating, title, content } = await request.json();
        const v = verifyUserId(request);
        if (v.error) return v.error;
        const userId = v.userId;
        const [existingReview] = await pollPool.query(
          `SELECT * FROM customer_reviews WHERE user_id = ? AND product_id = ?`,
          [userId, product_id]
        );
        if (existingReview.length > 0) {
          return json({ error: "You have already submitted a review for this product" }, 400);
        }
        await pollPool.query(
          `INSERT INTO customer_reviews (user_id, product_id, title, content, rating) VALUES (?, ?, ?, ?, ?)`,
          [userId, product_id, title, content, rating]
        );
        return json({ message: "Review successfully submitted" }, 201);
      }
    }

    if (head === "review" && parts[1] && method === "GET") {
      const id = parts[1];
      const query = `
      SELECT cr.*, u.name, u.avatar 
      FROM ${tblCustomerReviews()} cr
      INNER JOIN ${tblUsers()} u ON cr.user_id = u.user_id 
      WHERE cr.product_id = ?
    `;
      const [rows] = await pollPool.query(query, [id]);
      if (rows.length === 0) {
        return json({ message: "No reviews found for this product" }, 404);
      }
      return json({ status: 200, reviews: rows });
    }

    /* ---------------- wishlist ---------------- */
    if (head === "wishlist") {
      const v = verifyUserId(request);
      if (v.error) return v.error;
      const userId = v.userId;

      if (method === "GET" && parts.length === 1) {
        const query = `
      SELECT w.*, p.name, p.price, p.images, p.item_id as product_id, p.stock_quantity
      FROM wishlist w
      INNER JOIN ${tblProducts()} p ON w.product_id = p.item_id
      WHERE w.user_id = ?
    `;
        const [rows] = await userPool.query(query, [userId]);
        const formattedItems = rows.map((item) => {
          let images = [];
          try {
            images = typeof item.images === "string" ? JSON.parse(item.images) : item.images;
          } catch {
            images = [];
          }
          return {
            id: item.wishlist_id,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            image: images.length > 0 ? images[0] : null,
            stock_quantity: item.stock_quantity || 1,
          };
        });
        return json({ items: formattedItems });
      }

      if (method === "POST" && parts[1] === "add") {
        const { product_id } = await request.json();
        if (!product_id) return json({ error: "Product ID is required" }, 400);
        const [existing] = await userPool.query(`SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?`, [
          userId,
          product_id,
        ]);
        if (existing.length > 0) return json({ error: "Item already in wishlist" }, 400);
        await userPool.query(`INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)`, [userId, product_id]);
        return json({ message: "Item added to wishlist successfully" }, 201);
      }

      if (method === "DELETE" && parts[1] === "remove" && parts[2]) {
        const product_id = parts[2];
        const [result] = await userPool.query(`DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`, [
          userId,
          product_id,
        ]);
        if (result.affectedRows === 0) return json({ error: "Item not found in wishlist" }, 404);
        return json({ message: "Item removed from wishlist successfully" });
      }

      if (method === "DELETE" && parts[1] === "clear") {
        await userPool.query(`DELETE FROM wishlist WHERE user_id = ?`, [userId]);
        return json({ message: "Wishlist cleared successfully" });
      }
    }

    /* ---------------- cart ---------------- */
    if (head === "cart") {
      if (method === "GET" && parts.length === 1) {
        const v = verifyUserId(request);
        if (v.error) return v.error;
        const [rows] = await userPool.query(`SELECT * FROM Cart WHERE user_id = ? AND status = 'active'`, [
          v.userId,
        ]);
        return json({ cartItems: rows });
      }

      if (method === "POST" && parts[1] === "add") {
        const { items } = await request.json();
        if (!items || items.length === 0) return json({ error: "No items provided." }, 400);
        const v = verifyUserId(request);
        if (v.error) return v.error;
        const userId = v.userId;

        for (const item of items) {
          const [productRows] = await pollPool.query(`SELECT stock_quantity FROM ${tblProducts()} WHERE item_id = ?`, [
            item.id,
          ]);
          if (productRows.length === 0) {
            return json({ error: `Product ${item.id} not found` }, 404);
          }
          const stockQuantity = productRows[0].stock_quantity || 1;
          const requestedQty = Number(item.quantity || item.qty || 1);
          const [existingItem] = await userPool.query(`SELECT * FROM Cart WHERE user_id = ? AND id = ?`, [
            userId,
            item.id,
          ]);
          const finalQty = Math.min(requestedQty, stockQuantity);

          if (existingItem.length < 1) {
            await userPool.query(
              `INSERT INTO Cart (user_id, id, quantity, name, price, image, status) VALUES (?, ?, ?, ?, ?, ?, 'active')`,
              [userId, item.id, finalQty, item.name, item.price, item.image]
            );
          } else {
            await userPool.query(`UPDATE Cart SET quantity = ?, status = 'active' WHERE id = ? AND user_id = ?`, [
              finalQty,
              item.id,
              userId,
            ]);
          }

          if (requestedQty > stockQuantity) {
            return json({ message: "OUT OF STOCK - Maximum available quantity added", limited: true });
          }
        }
        return json({ message: "Cart updated successfully" });
      }

      if (method === "DELETE" && parts[1] === "remove" && parts[2]) {
        const v = verifyUserId(request);
        if (v.error) return v.error;
        const [result] = await userPool.query(`DELETE FROM Cart WHERE user_id = ? AND id = ?`, [
          v.userId,
          parts[2],
        ]);
        if (result.affectedRows === 0) return json({ message: "Item not found in cart." }, 404);
        return json({ message: "Item successfully removed from cart." });
      }

      if (method === "DELETE" && parts[1] === "clear") {
        const v = verifyUserId(request);
        if (v.error) return v.error;
        return json({ message: "Cart cleared from frontend only." });
      }

      if (method === "POST" && parts[1] === "apply-promo") {
        const { code, cartTotal } = await request.json();
        const [promo] = await pollPool.query(`SELECT * FROM ${tblPromoCodes()} WHERE code = ?`, [code]);
        if (!promo.length) return json({ error: "Invalid promo code" }, 400);
        const promoData = promo[0];
        if (promoData.expiry_date && new Date(promoData.expiry_date) < new Date()) {
          return json({ error: "Promo code expired" }, 400);
        }
        const discount = (cartTotal * promoData.discount_percent) / 100;
        const discountedTotal = cartTotal - discount;
        return json({
          message: "Promo applied successfully",
          discount: Math.round(discount),
          total: Math.round(discountedTotal),
          promo: code,
        });
      }
    }

    /* ---------------- products ---------------- */
    if (head === "products" && parts[1] === "trending" && method === "GET") {
      const [rows] = await pollPool.query(
        `SELECT * FROM ${tblProducts()} 
       WHERE is_trendy = 1 OR is_unique = 1 
       ORDER BY item_id DESC LIMIT 8`
      );
      const formattedRows = rows.map(formatProductRow);
      return json({ status: 200, rows: formattedRows });
    }

    if (head === "products" && parts.length === 1 && method === "GET") {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1", 10) || 1;
      const limit = parseInt(searchParams.get("limit") || "16", 10) || 16;
      const offset = (page - 1) * limit;
      const category = searchParams.get("category");
      const subcategory = searchParams.get("subcategory");
      const material = searchParams.get("material");

      const pt = tblProducts();
      let countQuery = `SELECT COUNT(*) AS count FROM ${pt}`;
      let dataQuery = `SELECT * FROM ${pt}`;
      const queryParams = [];
      const conditions = [];

      if (category) {
        conditions.push("category = ?");
        queryParams.push(category);
      }
      if (subcategory) {
        conditions.push("subcategory = ?");
        queryParams.push(subcategory);
      }
      if (material) {
        conditions.push("LOWER(TRIM(material)) = ?");
        queryParams.push(material.trim().toLowerCase());
      }
      if (conditions.length > 0) {
        const whereClause = " WHERE " + conditions.join(" AND ");
        countQuery += whereClause;
        dataQuery += whereClause;
      }
      dataQuery += " ORDER BY item_id DESC LIMIT ? OFFSET ?";
      queryParams.push(limit, offset);

      const [countResult] = await pollPool.query(countQuery, queryParams.slice(0, -2));
      const totalCount = countResult[0].count;
      const totalPages = Math.ceil(totalCount / limit);
      const [rows] = await pollPool.query(dataQuery, queryParams);
      const formattedRows = rows.map(formatProductRow);
      return json({ status: 200, currentPage: page, totalPages, rows: formattedRows });
    }

    if (head === "product" && parts[1] && method === "GET") {
      const id = parts[1];
      const [rows] = await pollPool.query(`SELECT * FROM ${tblProducts()} WHERE item_id = ?`, [id]);
      if (rows.length === 0) return json({ status: 404, message: "Product not found" }, 404);
      return json({ status: 200, rows: [rows[0]] });
    }

    if (head === "category" && parts[1] && method === "GET") {
      const category = parts[1];
      const p = tblProducts();
      const r = tblCustomerReviews();
      const query = `
      SELECT p.*, 
             AVG(r.rating) AS avg_rating, 
             COUNT(r.rating) AS ratings_length
      FROM ${p} p
      LEFT JOIN ${r} r ON p.item_id = r.product_id
      WHERE p.category = ?
      GROUP BY p.item_id
    `;
      const [rows] = await pollPool.query(query, [category]);
      if (rows.length === 0) {
        return json({ status: 404, message: "No products found in this category" }, 404);
      }
      return json({ status: 200, rows });
    }

    /* ---------------- orders ---------------- */
    if (head === "orders") {
      const o1 = parts[1];

      if (method === "GET" && o1 === "user") {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return json({ error: "Unauthorized access: Token missing" }, 401);
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;

        const query = `
      SELECT 
        o.order_id, o.total_amount, o.created_at,
        oi.product_id, oi.quantity, oi.price AS item_price,
        p.name AS product_name, p.images AS product_images
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN ${tblProducts()} p ON oi.product_id = p.item_id
      WHERE o.user_id = ?;
    `;
        const [rows] = await userPool.query(query, [userId]);
        if (rows.length === 0) {
          return json({ message: "No orders found for this user" }, 404);
        }
        const ordersMap = {};
        rows.forEach((row) => {
          if (!ordersMap[row.order_id]) {
            ordersMap[row.order_id] = {
              order_id: row.order_id,
              total_amount: row.total_amount,
              created_at: row.created_at,
              products: [],
            };
          }
          let productImage = null;
          if (row.product_images) {
            try {
              const imagesArray = JSON.parse(row.product_images);
              productImage = Array.isArray(imagesArray) ? imagesArray[0] : row.product_images;
            } catch {
              productImage = row.product_images;
            }
          }
          ordersMap[row.order_id].products.push({
            product_id: row.product_id,
            name: row.product_name,
            image: productImage,
            quantity: row.quantity,
            price: row.item_price,
          });
        });
        return json({ orders: Object.values(ordersMap) });
      }

      if (method === "POST" && o1 === "create") {
        const v = verifyUserId(request);
        if (v.error) return v.error;
        const userId = v.userId;
        const { total_amount, payment_method, order_status, transaction_id, products } = await request.json();
        if (!products || !Array.isArray(products) || products.length === 0) {
          return json({ error: "Products array is required" }, 400);
        }
        const [orderResult] = await userPool.query(
          `INSERT INTO orders (user_id, total_amount, payment_status, payment_method, order_status, transaction_id)
      VALUES (?, ?, 'pending', ?, ?, ?)`,
          [userId, total_amount, payment_method, order_status, transaction_id]
        );
        const orderId = orderResult.insertId;
        const orderItemsData = products.map((product) => [
          orderId,
          product.product_id,
          product.quantity,
          product.price,
        ]);
        await userPool.query(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`, [
          orderItemsData,
        ]);
        return json({ message: "Order created successfully", orderId }, 201);
      }

      if (o1 && o1 !== "user" && o1 !== "create" && o1 !== "address" && parts[2] === "address") {
        const orderId = o1;
        if (method === "POST") {
          const v = verifyUserId(request);
          if (v.error) return v.error;
          const userId = v.userId;
          const {
            full_name,
            phone_number,
            street_address,
            city,
            state,
            postal_code,
            country,
          } = await request.json();
          const [orderCheck] = await userPool.query(`SELECT user_id FROM orders WHERE order_id = ?`, [orderId]);
          if (orderCheck.length === 0) return json({ error: "Order not found" }, 404);
          if (orderCheck[0].user_id !== userId) {
            return json({ error: "You do not have permission to add an address to this order" }, 403);
          }
          await userPool.query(
            `INSERT INTO address_orders (order_id, user_id, full_name, phone_number, street_address, city, state, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [orderId, userId, full_name, phone_number, street_address, city, state, postal_code, country]
          );
          return json({ message: "Address added successfully" }, 201);
        }
        if (method === "GET") {
          const [rows] = await userPool.query(`SELECT * FROM address_orders WHERE order_id = ?`, [orderId]);
          if (rows.length === 0) {
            return json({ message: "Address not found for this order" }, 404);
          }
          return json({ address: rows[0] });
        }
      }

      if (o1 === "address" && parts[2]) {
        const addressId = parts[2];
        if (method === "PATCH") {
          const v = verifyUserId(request);
          if (v.error) return v.error;
          const userId = v.userId;
          const {
            full_name,
            phone_number,
            street_address,
            city,
            state,
            postal_code,
            country,
          } = await request.json();
          const [addressCheck] = await userPool.query(`SELECT user_id FROM address_orders WHERE address_id = ?`, [
            addressId,
          ]);
          if (addressCheck.length === 0) return json({ error: "Address not found" }, 404);
          if (addressCheck[0].user_id !== userId) {
            return json({ error: "You do not have permission to update this address" }, 403);
          }
          const [result] = await userPool.query(
            `UPDATE address_orders 
      SET full_name = ?, phone_number = ?, street_address = ?, city = ?, state = ?, postal_code = ?, country = ?
      WHERE address_id = ?`,
            [full_name, phone_number, street_address, city, state, postal_code, country, addressId]
          );
          if (result.affectedRows === 0) {
            return json({ message: "Address not found or unchanged" }, 404);
          }
          return json({ message: "Address updated successfully" });
        }
        if (method === "DELETE") {
          const v = verifyUserId(request);
          if (v.error) return v.error;
          const userId = v.userId;
          const [addressCheck] = await userPool.query(`SELECT user_id FROM address_orders WHERE address_id = ?`, [
            addressId,
          ]);
          if (addressCheck.length === 0) return json({ error: "Address not found" }, 404);
          if (addressCheck[0].user_id !== userId) {
            return json({ error: "You do not have permission to delete this address" }, 403);
          }
          const [result] = await userPool.query(`DELETE FROM address_orders WHERE address_id = ?`, [addressId]);
          if (result.affectedRows === 0) return json({ message: "Address not found" }, 404);
          return json({ message: "Address deleted successfully" });
        }
      }

      if (o1 && !["user", "create", "address"].includes(o1) && parts.length === 2) {
        const orderId = o1;
        if (method === "GET") {
          const query = `
      SELECT 
        o.order_id, o.total_amount, o.created_at,
        oi.product_id, oi.quantity, oi.price AS item_price,
        p.name AS product_name, p.images AS product_images,
        ao.full_name, ao.phone_number, ao.street_address, ao.city, ao.state, ao.postal_code, ao.country
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN ${tblProducts()} p ON oi.product_id = p.item_id
      LEFT JOIN address_orders ao ON o.order_id = ao.order_id
      WHERE o.order_id = ?;
    `;
          const [rows] = await userPool.query(query, [orderId]);
          if (rows.length === 0) return json({ message: "Order not found" }, 404);
          const order = {
            order_id: rows[0].order_id,
            total_amount: rows[0].total_amount,
            created_at: rows[0].created_at,
            address: {
              full_name: rows[0].full_name,
              phone_number: rows[0].phone_number,
              street_address: rows[0].street_address,
              city: rows[0].city,
              state: rows[0].state,
              postal_code: rows[0].postal_code,
              country: rows[0].country,
            },
            products: rows.map((row) => {
              let productImage = null;
              if (row.product_images) {
                try {
                  const imagesArray = JSON.parse(row.product_images);
                  productImage = Array.isArray(imagesArray) ? imagesArray[0] : row.product_images;
                } catch {
                  productImage = row.product_images;
                }
              }
              return {
                product_id: row.product_id,
                name: row.product_name,
                image: productImage,
                quantity: row.quantity,
                price: row.item_price,
              };
            }),
          };
          return json({ order });
        }
        if (method === "PATCH") {
          const { order_status } = await request.json();
          const [result] = await userPool.query(`UPDATE orders SET order_status = ? WHERE order_id = ?`, [
            order_status,
            orderId,
          ]);
          if (result.affectedRows === 0) return json({ message: "Order not found" }, 404);
          return json({ message: "Order status updated successfully" });
        }
        if (method === "DELETE") {
          await userPool.query(`DELETE FROM order_items WHERE order_id = ?`, [orderId]);
          const [result] = await userPool.query(`DELETE FROM orders WHERE order_id = ?`, [orderId]);
          if (result.affectedRows === 0) return json({ message: "Order not found" }, 404);
          return json({ message: "Order and associated items deleted successfully" });
        }
      }
    }

    /* ---------------- razorpay ---------------- */
    if (head === "create-order" && method === "POST") {
      const { amount } = await request.json();
      const order = await getRazorpay().orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      });
      return json({ success: true, order });
    }

    if (head === "verify-payment" && method === "POST") {
      const body = await request.json();
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = body;
      const sign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      if (sign !== razorpay_signature) {
        return json({ success: false, message: "Invalid signature" }, 400);
      }
      const token = getBearerToken(request);
      if (!token) return json({ success: false, message: "Unauthorized" }, 401);
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded.id;
      const { products, address, total_amount, free_ring_id } = orderData;

      const [orderRes] = await userPool.query(
        `INSERT INTO orders (user_id, total_amount, payment_status, payment_method, order_status, transaction_id)
       VALUES (?, ?, 'success', 'razorpay', 'confirmed', ?)`,
        [userId, total_amount, razorpay_payment_id]
      );
      const orderId = orderRes.insertId;

      if (address) {
        const {
          full_name,
          phone_number,
          street_address,
          city,
          state,
          postal_code,
          country,
        } = address;
        await userPool.query(
          `INSERT INTO address_orders (order_id, user_id, full_name, phone_number, street_address, city, state, postal_code, country)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            userId,
            full_name,
            phone_number,
            street_address,
            city,
            state,
            postal_code,
            country || "India",
          ]
        );
      }

      const orderItems = products.map((item) => [orderId, item.product_id, item.quantity, item.price]);
      const currentDate = new Date();
      const promotionEndDate = new Date("2026-01-31T23:59:59");
      const isPromotionActive = currentDate <= promotionEndDate;
      if (isPromotionActive && total_amount >= 1000 && free_ring_id) {
        orderItems.push([orderId, free_ring_id, 1, 0]);
      }
      await userPool.query(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`, [orderItems]);
      await userPool.query(`DELETE FROM Cart WHERE user_id = ?`, [userId]);

      const [rows] = await userPool.query(
        `SELECT 
        o.order_id, o.total_amount, o.created_at,
        oi.product_id, oi.quantity, oi.price AS item_price,
        p.name AS product_name, p.images AS product_images,
        ao.full_name, ao.phone_number, ao.street_address, ao.city, ao.state, ao.postal_code, ao.country
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       LEFT JOIN ${tblProducts()} p ON oi.product_id = p.item_id
       LEFT JOIN address_orders ao ON o.order_id = ao.order_id
       WHERE o.order_id = ?`,
        [orderId]
      );

      if (rows.length > 0) {
        const order = {
          order_id: rows[0].order_id,
          total_amount: rows[0].total_amount,
          created_at: rows[0].created_at,
          address: {
            full_name: rows[0].full_name,
            phone_number: rows[0].phone_number,
            street_address: rows[0].street_address,
            city: rows[0].city,
            state: rows[0].state,
            postal_code: rows[0].postal_code,
            country: rows[0].country,
          },
          products: rows.map((row) => {
            let productImage = null;
            try {
              const imagesArray = JSON.parse(row.product_images);
              productImage = Array.isArray(imagesArray) ? imagesArray[0] : row.product_images;
            } catch {
              productImage = row.product_images;
            }
            return {
              product_id: row.product_id,
              name: row.product_name,
              image: productImage,
              quantity: row.quantity,
              price: row.item_price,
            };
          }),
        };
        try {
          await sendInvoiceEmail(order);
        } catch (e) {
          console.error("Email error:", e.message);
        }
        try {
          await sendTelegramMessage(order);
        } catch (e) {
          console.error("Telegram error:", e.message);
        }
      }

      return json({ success: true, message: "Order verified and saved", orderId });
    }

    /* ---------------- promotion ---------------- */
    if (head === "promotion" && parts[1] === "free-ring" && parts[2] === "status" && method === "GET") {
      const currentDate = new Date();
      const promotionEndDate = new Date("2026-01-31T23:59:59");
      const isActive = currentDate <= promotionEndDate;
      if (!isActive) {
        return json({ active: false, message: "Promotion has ended" });
      }
      const query = `
      SELECT item_id, name, price, images, category, subcategory, stock_quantity
      FROM ${tblProducts()} 
      WHERE LOWER(TRIM(subcategory)) = 'rings'
      AND stock_quantity > 0
      ORDER BY item_id DESC
    `;
      const [rows] = await pollPool.query(query);
      const formattedRings = rows.map((ring) => {
        let parsedImages = [];
        try {
          parsedImages = typeof ring.images === "string" ? JSON.parse(ring.images) : ring.images || [];
        } catch {
          parsedImages = [];
        }
        return {
          product_id: ring.item_id,
          name: ring.name,
          price: ring.price,
          image: parsedImages[0] || null,
          category: ring.category,
          subcategory: ring.subcategory,
        };
      });
      return json({ active: true, rings: formattedRings, endDate: "2026-01-31" });
    }

    return json({ error: "Not found" }, 404);
  } catch (error) {
    console.error("API error:", error);
    return json({ error: error.message || "Internal server error" }, 500);
  }
}
