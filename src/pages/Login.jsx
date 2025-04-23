// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Footer, Navbar } from "../components";
// import { useDispatch } from "react-redux";
// import { syncCart } from "../redux/action";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate(); // Replaced useHistory with useNavigate
//   const dispatch = useDispatch(); // Initialize dispatch

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   //     const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/auth/signin", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ email, password }),
//   //     });

//   //     const data = await response.json();

//   //     if (!response.ok) {
//   //       throw new Error(data.message || "Login failed");
//   //     }

//   //     // Store token
//   //     localStorage.setItem("apitoken", data.token);

//   //     // Fetch and sync cart
//   //     const cartResponse = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart", {
//   //       headers: {
//   //         Authorization: `Bearer ${data.token}`,
//   //       },
//   //     });

//   //     const cartData = await cartResponse.json();
//   //     dispatch(syncCart(cartData.cartItems)); // Sync Redux with backend cart

//   //     // Redirect to Home
//   //     navigate("/");
//   //   } catch (err) {
//   //     setError(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       // ✅ Store token correctly
//       localStorage.setItem("apitoken", data.token);

//       // ✅ Fetch cart after login and sync with Redux
//       const cartResponse = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart", {
//         headers: { Authorization: `Bearer ${data.token}` },
//       });

//       const cartData = await cartResponse.json();
//       dispatch(syncCart(cartData.cartItems || [])); // ✅ Restore cart on login

//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container my-3 py-3">
//         <h1 className="text-center">Login</h1>
//         <hr />
//         <div className="row my-4 h-100">
//           <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
//             <form onSubmit={handleLogin}>
//               <div className="my-3">
//                 <label htmlFor="email">Email address</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   id="email"
//                   placeholder="name@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="my-3">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   id="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               {error && <div className="alert alert-danger">{error}</div>}
//               <div className="my-3">
//                 <p>
//                   New Here?{" "}
//                   <Link
//                     to="/register"
//                     className="text-decoration-underline text-info"
//                   >
//                     Register
//                   </Link>
//                 </p>
//               </div>
//               <div className="text-center">
//                 <button
//                   className="my-2 mx-auto btn btn-dark"
//                   type="submit"
//                   disabled={loading}
//                 >
//                   {loading ? "Logging in..." : "Login"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { useDispatch } from "react-redux";
import { syncCart } from "../redux/action";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("apitoken", data.token);

      const cartResponse = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const cartData = await cartResponse.json();
      dispatch(syncCart(cartData.cartItems || []));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* Global callback */
    window.handleGoogleLogin = async (response) => {
      try {
        const res = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Google login failed");

        localStorage.setItem("apitoken", data.token);

        const cartRes = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart", {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        const cartData = await cartRes.json();
        dispatch(syncCart(cartData.cartItems || []));
        navigate("/");
      } catch (err) {
        alert("❌ Google login failed");
        console.error("Google login error:", err);
      }
    };

    /* Render Google Sign-In Button */
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: "1045579484974-41hm64lraj3gt4i9shuclcdqcbgmllvk.apps.googleusercontent.com",
        callback: window.handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "signin_with",
        }
      );
    }
  }, [dispatch, navigate]);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleLogin}>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="my-3">
                <p>
                  New Here?{" "}
                  <Link to="/register" className="text-decoration-underline text-info">
                    Register
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            {/* ✅ Google Sign-In Button */}
            <div className="text-center mt-4">
              <div id="google-login-button"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;


