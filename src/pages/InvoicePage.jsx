import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";

const InvoicePage = () => {
  const { orderId } = useParams();
  const invoiceRef = useRef();
  const [order, setOrder] = React.useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/${orderId}`);
      const data = await res.json();
      if (res.ok) setOrder(data.order);
    };
    fetchOrder();
  }, [orderId]);

  const downloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current);
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice_${orderId}.pdf`);
  };

  if (!order) return <p className="text-center my-5">Loading Invoice...</p>;

  return (
    <div className="container my-5">
      <div ref={invoiceRef} className="border p-4 bg-light">
        <h3>Invoice - Order #{order.order_id}</h3>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        <hr />
        <h5>Customer Details</h5>
        <p>{order.address.full_name}</p>
        <p>{order.address.street_address}, {order.address.city}, {order.address.state} - {order.address.postal_code}, {order.address.country}</p>
        <p><strong>Phone:</strong> {order.address.phone_number}</p>
        <hr />
        <h5>Order Summary</h5>
        <ul className="list-group mb-3">
          {order.products.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between">
              {item.name} (x{item.quantity}) <span>Rs.{item.price}</span>
            </li>
          ))}
          <li className="list-group-item d-flex justify-content-between">
            <strong>Total</strong> <strong>Rs.{order.total_amount}</strong>
          </li>
        </ul>
        <p className="mt-3">
          For any queries, contact us at <strong>+91 8447145941</strong><br />
          WhatsApp: <a href="https://wa.me/8447145941" target="_blank" rel="noreferrer">Chat Now</a>
        </p>
      </div>

      <div className="text-end mt-4">
        <button onClick={downloadPDF} className="btn btn-primary">
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
