import React from "react";
import { Footer, Navbar } from "../components";

const ReturnPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-4 fw-bold">Return & Refund Policy</h2>
        <div className="p-4 rounded shadow-sm bg-light">
          <p>
            At <strong>Zairi</strong>, we strive to provide the best products and customer experience. Please read our return policy carefully before placing an order.
          </p>

          <h5 className="mt-4 fw-semibold">Delivery Timeline</h5>
          <ul>
          <li>🟢 <strong>Delhi NCR:</strong> Delivery within <strong>1-2 days</strong>, maximum up to <strong>5 days</strong>.</li>
          <li>🟡 <strong>Outside Delhi NCR:</strong> Delivery within <strong>3-5 days</strong>, maximum up to <strong>7 days</strong>.</li>
          </ul>

          <h5 className="mt-4 fw-semibold">Returns & Exchanges</h5>
          <p>
            We do <strong>not accept returns or exchanges</strong> unless the product is <strong>damaged during delivery</strong>.
          </p>

          <h5 className="mt-4 fw-semibold">How to Report Damage</h5>
          <ul>
            <li>The customer must report any product damage within <strong>24 hours of delivery</strong>.</li>
            <li>Send clear pictures of the damaged item to our team on WhatsApp or email at <a href="mailto:enquiryzairi@gmail.com">enquiryzairi@gmail.com</a>.</li>
            <li>Once verified, we will arrange a return or replacement as applicable.</li>
          </ul>

          <h5 className="mt-4 fw-semibold">No Return / No Exchange</h5>
          <p>
            If the damage is not reported within 24 hours, or the product is not damaged, we will <strong>not accept any return or exchange</strong>.
            Please ensure to inspect the product immediately upon delivery.
          </p>

          <p className="mt-4">
            For any queries regarding return eligibility, feel free to contact us at <a href="mailto:enquiryzairi@gmail.com">enquiryzairi@gmail.com</a> or WhatsApp us.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReturnPolicy;
