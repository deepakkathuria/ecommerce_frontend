"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer, Navbar } from "../components";
import { useDispatch } from "react-redux";
import { syncCart } from "../redux/action";
import { apiUrl } from "@/lib/apiBase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/auth/signin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("apitoken", data.token);

      const cartResponse = await fetch(apiUrl("/cart"), {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const cartData = await cartResponse.json();
      dispatch(syncCart(cartData.cartItems || []));
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.handleGoogleLogin = async (response) => {
      try {
        const res = await fetch(apiUrl("/auth/google-login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Google login failed");

        localStorage.setItem("apitoken", data.token);

        const cartRes = await fetch(apiUrl("/cart"), {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        const cartData = await cartRes.json();
        dispatch(syncCart(cartData.cartItems || []));
        router.push("/");
      } catch (err) {
        alert("❌ Google login failed");
        console.error("Google login error:", err);
      }
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          "1045579484974-41hm64lraj3gt4i9shuclcdqcbgmllvk.apps.googleusercontent.com",
        callback: window.handleGoogleLogin,
      });

      const target = document.getElementById("google-login-button");
      if (target) {
        const buttonWidth = Math.max(target.offsetWidth, 320);
        window.google.accounts.id.renderButton(target, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "signin_with",
          width: buttonWidth,
        });
      }
    }
  }, [dispatch, router]);

  return (
    <>
      <Navbar />
      <section className="login-page">
        <div className="container">
          <div className="login-heading text-center">
            <p className="eyebrow">Account access</p>
            <h1>Sign in to ZAIRI</h1>
            <p className="subtext">
              Manage orders, wishlist, and saved bag items in one place.
            </p>
          </div>

          <div className="login-card mx-auto">
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <div className="login-meta">
                <span>New here?</span>
                <Link href="/register">Create an account</Link>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="login-divider">
              <span>or continue with</span>
            </div>
            <div id="google-login-button" className="google-shell" />
          </div>
        </div>
      </section>
      <Footer />
      <style>{`
        .login-page {
          background: #fafafa;
          padding: 60px 0 80px;
          min-height: auto;
        }
        .login-heading .eyebrow {
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
          color: #777;
          margin-bottom: 10px;
        }
        .login-heading h1 {
          font-size: 38px;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .login-heading .subtext {
          color: #5c5c5c;
          font-size: 15px;
        }
        .login-card {
          max-width: 480px;
          width: 100%;
          background: #fff;
          border: 1px solid #e6e6e6;
          padding: 36px;
          margin-top: 28px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 12px;
          color: #555;
        }
        .form-group input {
          border: none;
          border-bottom: 1px solid #cfcfcf;
          padding: 12px 0;
          font-size: 15px;
          background: transparent;
          border-radius: 0;
        }
        .form-group input:focus {
          outline: none;
          border-color: #111;
        }
        .login-error {
          background: #ffeceb;
          color: #a20000;
          font-size: 13px;
          padding: 10px 14px;
        }
        .login-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #666;
        }
        .login-meta a {
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 12px;
          color: #111;
        }
        .login-btn {
          width: 100%;
          background: #111;
          color: #fff;
          border: none;
          padding: 14px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 13px;
        }
        .login-btn:disabled {
          opacity: 0.6;
        }
        .login-divider {
          text-align: center;
          margin: 24px 0 12px;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
        }
        .google-shell {
          display: flex;
          justify-content: center;
          min-height: 54px;
          align-items: center;
        }

        #google-login-button {
          width: 100%;
        }

        #google-login-button > div {
          width: 100% !important;
          min-height: 48px !important;
        }
        @media (max-width: 576px) {
          .login-card {
            padding: 28px 24px;
          }
          .login-heading h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
};

export default Login;
