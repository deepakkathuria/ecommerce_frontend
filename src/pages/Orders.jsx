// // import React, { useEffect, useState } from "react";
// // import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
// // import { useNavigate } from "react-router-dom";

// // const Orders = () => {
// //   const [orders, setOrders] = useState([]);
// //   const [selectedOrder, setSelectedOrder] = useState(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchOrders = async () => {
// //       const token = localStorage.getItem("apitoken");
// //       if (!token) return;

// //       try {
// //         const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/orders/user", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         const data = await response.json();
// //         if (response.ok) {
// //           setOrders(data.orders || []); // Ensure it always returns an array
// //         }
// //       } catch (error) {
// //         console.error("Error fetching orders:", error);
// //       }
// //     };

// //     fetchOrders();
// //   }, []);

// //   // Fetch Order Details and Show Modal
// //   const handleViewDetails = async (orderId) => {
// //     try {
// //       const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/${orderId}`);
// //       const data = await response.json();

// //       console.log("Fetched Order Data:", data);

// //       if (response.ok) {
// //         setSelectedOrder(data.order);
// //         setShowModal(true);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching order details:", error);
// //     }
// //   };

// //   return (
// //     <div className="container my-5">
// //       <h4>My Orders</h4>
// //       {orders.length === 0 ? (
// //         <p>No orders found.</p>
// //       ) : (
// //         <ul className="list-group">
// //           {orders.map((order) => (
// //             <li key={order.order_id} className="list-group-item">
// //               <strong>Order #{order.order_id}</strong> - {new Date(order.created_at).toLocaleDateString()}
// //               <p>Total: Rs.{order.total_amount}</p>

// //               {/* View Details Button */}
// //               <button
// //                 className="btn btn-outline-primary"
// //                 onClick={() => handleViewDetails(order.order_id)}
// //               >
// //                 View Details
// //               </button>
// //             </li>
// //           ))}
// //         </ul>
// //       )}

// //       {/* Modal for Viewing Order Details */}
// //       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
// //         <Modal.Header closeButton>
// //           <Modal.Title>Order Details</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           {selectedOrder && (
// //             <>
// //               <h4>Order #{selectedOrder.order_id}</h4>
// //               <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
// //               <p><strong>Total:</strong> Rs.{selectedOrder.total_amount}</p>

// //               <h5>Products</h5>
// //               <ul className="list-group">
// //                 {selectedOrder.products.map((product, index) => {
// //                   const productImage =
// //                     Array.isArray(product.image) && product.image.length > 0
// //                       ? product.image[0] // First image from the array
// //                       : "https://via.placeholder.com/100"; // Fallback image

// //                   return (
// //                     <li key={index} className="list-group-item d-flex align-items-center">
// //                       {/* Product Image Display */}
// //                       <img
// //                         src={productImage}
// //                         alt={product.name}
// //                         className="me-3"
// //                         style={{
// //                           width: "80px",
// //                           height: "80px",
// //                           objectFit: "contain",
// //                           borderRadius: "5px",
// //                           border: "1px solid #ddd",
// //                         }}
// //                       />

// //                       {/* Product Info */}
// //                       <div>
// //                         <p className="m-0"><strong>{product.name}</strong></p>
// //                         <p className="m-0">Qty: {product.quantity} | Price: Rs.{product.price}</p>
// //                       </div>
// //                     </li>
// //                   );
// //                 })}
// //               </ul>
// //             </>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default Orders;






// import React, { useEffect, useState } from "react";
// import { Modal, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("apitoken");
//       if (!token) return;

//       try {
//         const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/orders/user", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setOrders(data.orders || []);
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleViewDetails = async (orderId) => {
//     try {
//       const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/${orderId}`);
//       const data = await response.json();

//       if (response.ok) {
//         setSelectedOrder(data.order);
//         setShowModal(true);
//       }
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h4>My Orders</h4>
//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <ul className="list-group">
//           {orders.map((order) => (
//             <li key={order.order_id} className="list-group-item">
//               <strong>Order #{order.order_id}</strong> - {new Date(order.created_at).toLocaleDateString()}
//               <p>Total: Rs.{order.total_amount}</p>
//               <button
//                 className="btn btn-outline-primary"
//                 onClick={() => handleViewDetails(order.order_id)}
//               >
//                 View Details
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* ✅ Modal for Viewing Order Details */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Order Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
//           {selectedOrder && (
//             <>
//               <h4>Order #{selectedOrder.order_id}</h4>
//               <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
//               <p><strong>Total:</strong> Rs.{selectedOrder.total_amount}</p>

//               {/* ✅ Address Section */}
//               <h5 className="mt-4">Shipping Address</h5>
//               {selectedOrder.address ? (
//                 <div className="mb-4 border rounded p-3 bg-light">
//                   <p className="mb-1"><strong>Name:</strong> {selectedOrder.address.full_name}</p>
//                   <p className="mb-1"><strong>Phone:</strong> {selectedOrder.address.phone_number}</p>
//                   <p className="mb-1">
//                     <strong>Address:</strong> {selectedOrder.address.street_address}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.postal_code}
//                   </p>
//                   <p className="mb-1"><strong>Country:</strong> {selectedOrder.address.country}</p>
//                 </div>
//               ) : (
//                 <p className="text-danger">No address found for this order.</p>
//               )}

//               {/* ✅ Product Section */}
//               <h5>Products</h5>
//               <ul className="list-group">
//                 {selectedOrder.products.map((product, index) => {
//                   const productImage =
//                     Array.isArray(product.image) && product.image.length > 0
//                       ? product.image[0]
//                       : "https://via.placeholder.com/100";

//                   return (
//                     <li key={index} className="list-group-item d-flex align-items-center">
//                       <img
//                         src={productImage}
//                         alt={product.name}
//                         className="me-3"
//                         style={{
//                           width: "80px",
//                           height: "80px",
//                           objectFit: "cover",
//                           borderRadius: "5px",
//                           border: "1px solid #ddd",
//                         }}
//                       />
//                       <div>
//                         <p className="m-0"><strong>{product.name}</strong></p>
//                         <p className="m-0">Qty: {product.quantity} | Price: Rs.{product.price}</p>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Orders;




import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("apitoken");
      if (!token) return;

      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/orders/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = async (orderId) => {
    try {
      const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedOrder(data.order);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container my-5">
      <h4>My Orders</h4>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order.order_id} className="list-group-item">
              <strong>Order #{order.order_id}</strong> - {formatDate(order.created_at)}
              <p>Total: Rs.{order.total_amount}</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleViewDetails(order.order_id)}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {selectedOrder && (
            <>
              <h4>Order #{selectedOrder.order_id}</h4>
              <p><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
              <p><strong>Total:</strong> Rs.{selectedOrder.total_amount}</p>

              <h5 className="mt-4">Shipping Address</h5>
              {selectedOrder.address ? (
                <div className="mb-4 border rounded p-3 bg-light">
                  <p className="mb-1"><strong>Name:</strong> {selectedOrder.address.full_name}</p>
                  <p className="mb-1"><strong>Phone:</strong> {selectedOrder.address.phone_number}</p>
                  <p className="mb-1">
                    <strong>Address:</strong> {selectedOrder.address.street_address}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.postal_code}
                  </p>
                  <p className="mb-1"><strong>Country:</strong> {selectedOrder.address.country}</p>
                </div>
              ) : (
                <p className="text-danger">No address found for this order.</p>
              )}

              <h5>Products</h5>
              <ul className="list-group">
                {selectedOrder.products.map((product, index) => {
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
