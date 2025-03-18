import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/${orderId}`);
        const data = await response.json();

        console.log("Fetched Order Data:", data);

        if (response.ok) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <p>Loading order details...</p>;
  }

  return (
    <div className="container my-5">
      <h4>Order #{order.order_id}</h4>
      <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
      <p><strong>Total:</strong> Rs.{order.total_amount}</p>

      <h5>Products</h5>
      <ul className="list-group">
        {order.products.map((product, index) => {
          // Select the first image from the array or use a placeholder
          const productImage =
            Array.isArray(product.image) && product.image.length > 0
              ? product.image[0] // First image from the array
              : "https://via.placeholder.com/100"; // Fallback image

          return (
            <li key={index} className="list-group-item d-flex align-items-center">
              {/* Product Image Display */}
              <img
                src={productImage}
                alt={product.name}
                className="me-3"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              />

              {/* Product Info */}
              <div>
                <p className="m-0"><strong>{product.name}</strong></p>
                <p className="m-0">Qty: {product.quantity} | Price: Rs.{product.price}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderDetails;
