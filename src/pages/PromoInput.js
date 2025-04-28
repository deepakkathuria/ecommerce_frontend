import React, { useState } from "react";

const PromoInput = ({ subtotal, setDiscount, setPromoApplied }) => {
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");

  const applyPromo = async () => {
    setError("");

    try {
      const res = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/apply-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode.trim().toUpperCase(),
          cartTotal: subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid promo code");
        return;
      }

      setDiscount(data.discount);
      setPromoApplied(true);
      alert(`✅ Promo applied! You saved ₹${data.discount}`);
    } catch (err) {
      console.error("Promo error:", err);
      setError("❌ Failed to apply promo");
    }
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault(); // ✅ Stop page reload
    applyPromo();
  };

  return (
    <form className="mt-3" onSubmit={handlePromoSubmit}>
      <label htmlFor="promo" className="form-label">Apply Promo Code</label>
      <div className="input-group">
        <input
          type="text"
          id="promo"
          className="form-control"
          value={promoCode}
          onChange={(e) => {
            setPromoCode(e.target.value);
            setError("");
          }}
          placeholder="Enter promo code"
        />
        <button
          className="btn btn-dark"
          type="submit"  // ✅ Now submit, but handled safely
          disabled={promoCode.trim() === ""}
        >
          Apply
        </button>
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
};

export default PromoInput;
