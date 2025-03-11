// Add item to cart and sync with backend
export const addCart = (product) => async (dispatch, getState) => {
    try {
      const token = localStorage.getItem("apitoken");
      const state = getState().handleCart;
  
      // Check if product exists in cart and update backend
      const updatedCart = state.map((item) =>
        item.id === product.id ? { ...item, qty: (item.qty || 0) + 1 } : item
      );
  
      // Sync with backend
      await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: updatedCart }),
      });
  
      dispatch({ type: "ADDITEM", payload: product });
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };
  
  // Remove item from cart and sync with backend
  export const delCart = (product) => async (dispatch, getState) => {
    try {
      const token = localStorage.getItem("apitoken");
  
      // Update backend
      await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/cart/remove/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      dispatch({ type: "DELITEM", payload: product });
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };
  
  // Sync cart from backend
  export const syncCart = (items) => {
    return {
      type: "SYNC_CART",
      payload: items,
    };
  };
  
  // Clear cart and sync with backend
  export const clearCart = () => async (dispatch) => {
    try {
      const token = localStorage.getItem("apitoken");
  
      // Clear cart in backend
      await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };
  