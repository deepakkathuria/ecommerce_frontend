import React from "react";
import { Footer, Navbar } from "../components";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-4 fw-bold">Privacy Policy</h2>
        <div className="p-4 rounded shadow-sm bg-light">
          <p>
            At <strong>Zairi</strong>, we are committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and shared when you visit or make a purchase from our website.
          </p>

          <h5 className="mt-4 fw-semibold">1. Information We Collect</h5>
          <p>
            We collect information such as your name, email address, shipping address, billing address, phone number, and payment information when you place an order or register on our site.
          </p>

          <h5 className="mt-4 fw-semibold">2. How We Use Your Information</h5>
          <p>
            We use your information to:
            <ul>
              <li>Process transactions and deliver your orders</li>
              <li>Send order updates and promotional emails</li>
              <li>Improve our website and customer service</li>
            </ul>
          </p>

          <h5 className="mt-4 fw-semibold">3. Sharing Your Information</h5>
          <p>
            We do not sell, trade, or rent your personal information. We may share data with trusted third-party services to help us operate our business, such as payment gateways and delivery partners.
          </p>

          <h5 className="mt-4 fw-semibold">4. Cookies</h5>
          <p>
            We use cookies to enhance your browsing experience and gather analytics about site traffic. You can disable cookies through your browser settings.
          </p>

          <h5 className="mt-4 fw-semibold">5. Your Rights</h5>
          <p>
            You have the right to access, correct, or delete your personal data. You can contact us at any time for support.
          </p>

          <h5 className="mt-4 fw-semibold">6. Changes to This Policy</h5>
          <p>
            We may update this Privacy Policy occasionally. Changes will be posted on this page with an updated revision date.
          </p>

          <p className="mt-4">
            If you have any questions about this policy, please contact us at <a href="mailto:info@zairi.in">enquiryzairi@gmail.com</a>.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
