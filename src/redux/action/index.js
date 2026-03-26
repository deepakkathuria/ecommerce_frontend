import { apiUrl } from "@/lib/apiBase";

// Add item to cart and sync with backend
export const addCart = (product) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("apitoken");
    const state = getState().handleCart;

    const existingItem = state.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = state.map((item) =>
        item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
      );
    } else {
      updatedCart = [...state, { ...product, qty: 1 }];
    }

    const itemsToSend = updatedCart.map((item) => ({
      id: item.id,
      quantity: item.qty || 1,
      name: item.name || item.title,
      price: item.price,
      image: item.image || (item.images && item.images[0]) || "",
    }));

    await fetch(apiUrl("/cart/add"), {
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

export const delCart = (product) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("apitoken");
    const state = getState().handleCart;

    const existingItem = state.find((item) => item.id === product.id);

    if (existingItem && existingItem.qty > 1) {
      const newQuantity = existingItem.qty - 1;

      await fetch(apiUrl(`/cart/remove/${product.id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const itemToAdd = {
        id: product.id,
        quantity: newQuantity,
        name: existingItem.name || product.name,
        price: existingItem.price || product.price,
        image: existingItem.image || product.image,
      };

      await fetch(apiUrl("/cart/add"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: [itemToAdd] }),
      });
    } else {
      await fetch(apiUrl(`/cart/remove/${product.id}`), {
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

export const syncCart = (items) => {
  return {
    type: "SYNC_CART",
    payload: items,
  };
};

export const clearCart = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("apitoken");

    await fetch(apiUrl("/cart/clear"), {
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
