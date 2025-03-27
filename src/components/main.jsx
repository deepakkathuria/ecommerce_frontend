// import React, { Suspense } from "react";
// import { Navbar, Footer } from "../components";
// import { NavLink } from "react-router-dom";

// const HomePage = () => {
//   return (
//     <>
    

//       <div
//         style={{
//           background: "linear-gradient(to right, #d4fc79, #96e6a1)",
//           minHeight: "80vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           textAlign: "center",
//           padding: "2rem",
//         }}
//       >
//         <div
//           className="container fade-in"
//           style={{ animation: "fadeInUp 1s ease-in-out" }}
//         >
//           <h1
//             className="fw-bold mb-3"
//             style={{ fontSize: "2.4rem", color: "#1a1a1a" }}
//           >
//             Welcome to <span style={{ color: "#007bff" }}>Zairi</span>
//           </h1>
//           <p
//             style={{
//               maxWidth: "600px",
//               margin: "0 auto",
//               fontSize: "1.1rem",
//               color: "#333",
//               lineHeight: "1.6",
//             }}
//           >
//             Discover thoughtfully curated accessories that bring joy and
//             confidence to your everyday look.
//           </p>
//           <NavLink
//             to="/product"
//             className="btn btn-dark mt-4"
//             style={{ padding: "0.6rem 1.5rem", fontWeight: "bold" }}
//           >
//             🛍️ Shop Now
//           </NavLink>
//         </div>
//       </div>

//       <Suspense fallback={<div className="text-center py-3">Loading footer...</div>}>
//       </Suspense>

//       {/* 💫 Pure CSS animation */}
//       <style>{`
//         @keyframes fadeInUp {
//           0% {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .fade-in {
//           animation: fadeInUp 0.8s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default HomePage;








import React, { Suspense } from "react";
import { Navbar, Footer } from "../components";
import { NavLink } from "react-router-dom";

const HomePage = () => {
  return (
    <>

      {/* 🔔 Razorpay Payment Status Notice */}
      <div
        style={{
          backgroundColor: "#fff3cd",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #ffeeba",
          margin: "20px auto",
          maxWidth: "800px",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
        }}
      >
        <strong>🛍️ Payments Update:</strong> Razorpay integration is under review.
        Payments will be live in <strong>2-3 days</strong>.
        <br />
        For orders or help, <strong>WhatsApp us</strong>
      </div>

      {/* 💫 Hero Section */}
      <div
        style={{
          background: "linear-gradient(to right, #d4fc79, #96e6a1)",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div
          className="container fade-in"
          style={{ animation: "fadeInUp 1s ease-in-out" }}
        >
          <h1
            className="fw-bold mb-3"
            style={{ fontSize: "2.4rem", color: "#1a1a1a" }}
          >
            Welcome to <span style={{ color: "#007bff" }}>Zairi</span>
          </h1>
          <p
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              fontSize: "1.1rem",
              color: "#333",
              lineHeight: "1.6",
            }}
          >
            Discover thoughtfully curated accessories that bring joy and
            confidence to your everyday look.
          </p>
          <NavLink
            to="/product"
            className="btn btn-dark mt-4"
            style={{ padding: "0.6rem 1.5rem", fontWeight: "bold" }}
          >
            🛍️ Shop Now
          </NavLink>
        </div>
      </div>


      {/* Animation CSS */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </>
  );
};

export default HomePage;
