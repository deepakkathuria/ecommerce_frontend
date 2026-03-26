import React from "react";
import { Footer, Navbar } from "../components";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary mb-3">Privacy Policy</h1>
              <p className="lead text-muted">
                At Zairi, we are committed to protecting your privacy.
              </p>
            </div>

            <div className="card shadow-sm">
              <div className="card-body p-5">
                <div className="mb-4">
                  <p className="lead">
                    At Zairi, we are committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and shared when you visit or make a purchase from our website.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">1. Information We Collect</h4>
                  <p>
                    We collect information such as your name, email address, shipping address, billing address, phone number, and payment information when you place an order or register on our site.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">2. How We Use Your Information</h4>
                  <p>We use your information to:</p>
                  <ul className="list-unstyled ms-3">
                    <li><i className="fa fa-check text-success me-2"></i>Process transactions and deliver your orders</li>
                    <li><i className="fa fa-check text-success me-2"></i>Send order updates and promotional emails</li>
                    <li><i className="fa fa-check text-success me-2"></i>Improve our website and customer service</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">3. Sharing Your Information</h4>
                  <p>
                    We do not sell, trade, or rent your personal information. We may share data with trusted third-party services to help us operate our business, such as payment gateways and delivery partners.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">4. Cookies</h4>
                  <p>
                    We use cookies to enhance your browsing experience and gather analytics about site traffic. You can disable cookies through your browser settings.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">5. Your Rights</h4>
                  <p>
                    You have the right to access, correct, or delete your personal data. You can contact us at any time for support.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">6. Changes to This Policy</h4>
                  <p>
                    We may update this Privacy Policy occasionally. Changes will be posted on this page with an updated revision date.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">Contact Us</h4>
                  <div className="alert alert-info">
                    <p className="mb-0">
                      If you have any questions about this policy, please contact us at{' '}
                      <a href="mailto:enquiryzairi@gmail.com" className="text-decoration-none">
                        enquiryzairi@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
