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
        if (response.ok) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!order) {
    return <p className="text-center my-5">Loading order details...</p>;
  }

  return (
    <div className="container my-5">
      <h4 className="mb-3">Order #{order.order_id}</h4>
      <p><strong>Date:</strong> {formatDate(order.created_at)}</p>
      <p><strong>Total:</strong> Rs.{order.total_amount}</p>

      <h5 className="mt-4">Shipping Address</h5>
      {order.address ? (
        <div className="mb-4 border rounded p-3 bg-light">
          <p className="mb-1"><strong>Name:</strong> {order.address.full_name}</p>
          <p className="mb-1"><strong>Phone:</strong> {order.address.phone_number}</p>
          <p className="mb-1">
            <strong>Address:</strong> {order.address.street_address}, {order.address.city}, {order.address.state} - {order.address.postal_code}
          </p>
          <p className="mb-1"><strong>Country:</strong> {order.address.country}</p>
        </div>
      ) : (
        <p className="text-danger">No address found for this order.</p>
      )}

      <h5>Products</h5>
      <ul className="list-group">
        {order.products.map((product, index) => {
          const productImage =
            Array.isArray(product.image) && product.image.length > 0
              ? product.image[0]
              : "https://via.placeholder.com/100";

          return (
            <li key={index} className="list-group-item d-flex align-items-center">
              <img
                src={productImage}
                alt={product.name}
                className="me-3"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              />
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
