import React, { useEffect, useState } from "react";
import { Navbar } from "../components";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("apitoken");
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setWishlist(data.items);
    };

    fetchWishlist();
  }, []);

  return (
    <div>

      <h4>Wishlist</h4>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul className="list-group">
          {wishlist.map((item) => (
            <li key={item.id} className="list-group-item">
              {item.name} - ${item.price}
              <button className="btn btn-danger btn-sm float-right">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
