import React from 'react';
import { Footer, Navbar } from "../components";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-5 py-4">
        <h1 className="text-center fw-bold mb-4">✨ About Zairi ✨</h1>
        <div className="bg-light rounded shadow p-4">
          <h4 className="fw-bold mb-3 text-center text-uppercase">Hi Everyone!</h4>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.9", textAlign: "center" }}>
            We at <strong>Zairi</strong>, have always been passionate about creativity and fashion,
            which is why we started this journey into <strong>kawaii fashion and accessories</strong>! 
            Right now, we’re bringing you the <strong>cutest jewelry</strong>, carefully curated for 
            quality and style, but this is just the beginning!
          </p>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.9", textAlign: "center" }}>
            Big plans are in motion to expand into even more adorable and trendy 
            <strong> kawaii products</strong>. 🎀💖 This isn’t just another shop — it’s a 
            <strong> brand built with heart</strong>. Every piece is thoughtfully selected to 
            bring <strong>joy, confidence</strong>, and a touch of <strong>magic</strong> 
            to your everyday look. ❤️
          </p>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.9", textAlign: "center" }}>
            Your support means everything, and we would love for you to be part of this journey! 
            Let’s make the world a little <strong>cuter, one accessory at a time</strong>. 🌸✨
          </p>

          <p className="text-center mt-4 fw-bold" style={{ fontSize: "1.2rem" }}>
            Z A I R I . I N
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
