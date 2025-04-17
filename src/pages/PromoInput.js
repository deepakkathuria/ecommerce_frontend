// import React, { useState } from "react";

// const PromoInput = ({ subtotal, setDiscount, setTotal, promoApplied, setPromoApplied }) => {
//   const [promoCode, setPromoCode] = useState("");
//   const [error, setError] = useState("");

//   const applyPromo = async () => {
//     setError("");
//     try {
//       const res = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/apply-promo", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: promoCode.trim(), cartTotal: subtotal }),
//       });

//       const data = await res.json();

//       console.log("Promo response status:", res.status);
//       console.log("Promo response data:", data);

//       if (!res.ok) {
//         setError(data.error || "Invalid promo code");
//         return;
//       }

//       setDiscount(data.discount);
//       setTotal(data.total);
//       setPromoApplied(true);
//       alert("✅ Promo applied successfully!");
//     } catch (err) {
//       console.error("Promo error:", err);
//       setError("❌ Failed to apply promo");
//     }
//   };

//   return (
//     <div className="mt-3">
//       <label htmlFor="promo" className="form-label">
//         Apply Promo Code
//       </label>
//       <div className="input-group">
//         <input
//           type="text"
//           id="promo"
//           className="form-control"
//           value={promoCode}
//           onChange={(e) => {
//             setPromoCode(e.target.value);
//             setError(""); // clear error while typing
//           }}
//           placeholder="Enter promo code"
//           disabled={promoApplied}
//         />
//         <button
//           className="btn btn-dark"
//           type="button"
//           onClick={applyPromo}
//           disabled={promoApplied || promoCode.trim() === ""}
//         >
//           Apply
//         </button>
//       </div>
//       {error && <div className="text-danger mt-2">{error}</div>}
//     </div>
//   );
// };

// export default PromoInput;




import React, { useState } from "react";

const PromoInput = ({ subtotal, setDiscount, setTotal }) => {
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false); // ✅ Local state here

  const applyPromo = async () => {
    setError("");

    try {
      const res = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/apply-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode.trim().toUpperCase(),
          cartTotal: subtotal
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid promo code");
        return;
      }

      setDiscount(data.discount);
      setTotal(data.total);
      setPromoApplied(true); // ✅ Mark promo as applied

      // ✅ Show nice alert
      alert(`✅ Promo code applied!\n🎉 You saved ₹${data.discount}\nNew total: ₹${data.total}`);
    } catch (err) {
      console.error("Promo error:", err);
      setError("❌ Failed to apply promo");
    }
  };

  return (
    <div className="mt-3">
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
          disabled={promoApplied}
        />
        <button
          className="btn btn-dark"
          type="button"
          onClick={applyPromo}
          disabled={promoApplied || promoCode.trim() === ""}
        >
          Apply
        </button>
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default PromoInput;
