import React from "react";
import { Footer, Navbar } from "../components";

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-5 py-5">
        <h1 className="text-center mb-4">Contact Us</h1>
        <hr className="w-50 mx-auto mb-5" />

        <div className="row align-items-center justify-content-center">
          {/* Contact Information */}
          <div className="col-md-6 col-12 text-center text-md-start">
            <h3 className="fw-bold">Zairi</h3>
            <p className="mt-3">
              C-5/81, Rohini Sector 5, <br />
              Delhi 110085
            </p>

            <h5 className="fw-bold mt-4">Email</h5>
            <p>
              <a href="mailto:enquiry@zairi.com" className="text-dark text-decoration-none">
              enquiryzairi@gmail.com
              </a>
            </p>

            <h5 className="fw-bold mt-4">Phone</h5>
            <p>
              <a href="tel:+918279751904" className="text-dark text-decoration-none">
                +91-8447145941
              </a>
            </p>
          </div>

          {/* Google Maps Embed Section */}
          <div className="col-md-6 col-12 mt-4 mt-md-0 text-center">
            <h5 className="fw-bold">Find Us on Map</h5>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1749.5443215211553!2d77.10508562825757!3d28.71689678337747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d014d916d34f9%3A0x20c91454bbda20be!2sC5%2F81!5e0!3m2!1sen!2sin!4v1741150910317!5m2!1sen!2sin"
              width="600"
              height="450"
              style={{ border: "0", width: "100%", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
