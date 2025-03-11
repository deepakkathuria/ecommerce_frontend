import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("apitoken");
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h4>My Orders</h4>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order.id} className="list-group-item">
              <strong>Order #{order.id}</strong> - {order.date}
              <p>Total: ${order.total}</p>
              <button className="btn btn-outline-primary">View Details</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
