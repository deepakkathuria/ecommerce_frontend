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
  
      // Sync with backend - send items with quantity field
      const itemsToSend = updatedCart.map(item => ({
        id: item.id,
        quantity: item.qty || 1,
        name: item.name || item.title,
        price: item.price,
        image: item.image || (item.images && item.images[0]) || '',
      }));
      
      await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: itemsToSend }),
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
        // Backend /cart/add ADDS to existing quantity, so we need to:
        // 1. Remove the item first
        // 2. Then add it back with the new quantity
        const newQuantity = existingItem.qty - 1;
        
        // First, remove the item
        await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/cart/remove/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Then add it back with the new quantity
        const itemToAdd = {
          id: product.id,
          quantity: newQuantity,
          name: existingItem.name || product.name,
          price: existingItem.price || product.price,
          image: existingItem.image || product.image,
        };
        
        await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: [itemToAdd] }),
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
  