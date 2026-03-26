import React from "react";
import { Footer, Navbar } from "../components";

const ReturnPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary mb-3">Return & Refund Policy</h1>
              <p className="lead text-muted">
                At Zairi, we strive to provide the best products and customer experience.
              </p>
            </div>

            <div className="card shadow-sm">
              <div className="card-body p-5">
                <div className="mb-4">
                  <p className="lead">
                    At Zairi, we strive to provide the best products and customer experience. Please read our return policy carefully before placing an order.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">Delivery Timeline</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border-success mb-3">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0">
                            <i className="fa fa-check me-2"></i>
                            Delhi NCR
                          </h6>
                        </div>
                        <div className="card-body">
                          <p className="mb-0">Delivery within 1-2 days, maximum up to 5 days.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-warning mb-3">
                        <div className="card-header bg-warning text-dark">
                          <h6 className="mb-0">
                            <i className="fa fa-clock me-2"></i>
                            Outside Delhi NCR
                          </h6>
                        </div>
                        <div className="card-body">
                          <p className="mb-0">Delivery within 3-5 days, maximum up to 7 days.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">Returns & Exchanges</h4>
                  <div className="alert alert-info">
                    <p className="mb-0">
                      We do not accept returns or exchanges unless the product is damaged during delivery.
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">How to Report Damage</h4>
                  <ul className="list-unstyled ms-3">
                    <li className="mb-2">
                      <i className="fa fa-clock text-warning me-2"></i>
                      The customer must report any product damage within 24 hours of delivery.
                    </li>
                    <li className="mb-2">
                      <i className="fa fa-camera text-info me-2"></i>
                      Send clear pictures of the damaged item to our team on WhatsApp or email at{' '}
                      <a href="mailto:enquiryzairi@gmail.com" className="text-decoration-none">
                        enquiryzairi@gmail.com
                      </a>
                    </li>
                    <li className="mb-2">
                      <i className="fa fa-check text-success me-2"></i>
                      Once verified, we will arrange a return or replacement as applicable.
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">No Return / No Exchange</h4>
                  <div className="alert alert-warning">
                    <p className="mb-0">
                      If the damage is not reported within 24 hours, or the product is not damaged, we will not accept any return or exchange. Please ensure to inspect the product immediately upon delivery.
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-primary mb-3">Contact Us</h4>
                  <div className="alert alert-success">
                    <p className="mb-0">
                      For any queries regarding return eligibility, feel free to contact us at{' '}
                      <a href="mailto:enquiryzairi@gmail.com" className="text-decoration-none">
                        enquiryzairi@gmail.com
                      </a>{' '}
                      or WhatsApp us.
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

export default ReturnPolicy;
