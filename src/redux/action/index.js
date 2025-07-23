// Add item to cart and sync with backend
export const addCart = (product) => async (dispatch, getState) => {
    try {
      const token = localStorage.getItem("apitoken");
      const state = getState().handleCart;
  
      // Check if product exists in cart and update backend
      const existingItem = state.find(item => item.id === product.id);
      let updatedCart;
      
      if (existingItem) {
        // Update quantity for existing item
        updatedCart = state.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      } else {
        // Add new item
        updatedCart = [...state, { ...product, qty: 1 }];
      }
  
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
      const state = getState().handleCart;
  
      // Find the item to check its quantity
      const existingItem = state.find(item => item.id === product.id);
      
      if (existingItem && existingItem.qty > 1) {
        // Decrease quantity
        const updatedCart = state.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty - 1 } : item
        );
        
        // Update backend with new cart state
        await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: updatedCart }),
        });
      } else {
        // Remove item completely
        await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/cart/remove/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
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
  