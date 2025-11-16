// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM":
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        // 👉 Do NOT allow more than 1 piece per product
        // Keep quantity at 1 and return the same cart
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: 1 } : x
        );
      } else {
        updatedCart = [...state, { ...product, qty: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "DELITEM":
      const exist2 = state.find((x) => x.id === product.id);
      if (exist2) {
        if (exist2.qty === 1) {
          updatedCart = state.filter((x) => x.id !== exist2.id);
        } else {
          updatedCart = state.map((x) =>
            x.id === product.id ? { ...x, qty: x.qty - 1 } : x
          );
        }
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        updatedCart = [...state]; // Keep the state unchanged if item doesn't exist
      }
      return updatedCart;

    case "CLEAR_CART":
      updatedCart = [];
      localStorage.removeItem("cart"); // Clear cart from localStorage
      return updatedCart;

    case "SYNC_CART":
      // Ensure that `qty` is correctly set from `quantity`
      updatedCart = action.payload.map((item) => ({
        ...item,
        qty: item.qty || item.quantity || 1, // Ensure qty is assigned properly
      }));
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Sync with localStorage
      return updatedCart;

    default:
      return state;
  }
};

export default handleCart;
