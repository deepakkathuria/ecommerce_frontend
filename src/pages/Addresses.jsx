import React, { useEffect, useState } from "react";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("apitoken");
      if (!token) return;

      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/orders/address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setAddresses(data.addresses);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const handleRemove = async (id) => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;

    try {
      const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/address/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAddresses(addresses.filter((addr) => addr.address_id !== id));
      }
    } catch (error) {
      console.error("Error removing address:", error);
    }
  };

  return (
    <div>
      <h4>Addresses</h4>
      {addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        addresses.map((addr) => (
          <div key={addr.address_id} className="mb-3">
            <p>{addr.street_address}, {addr.city}, {addr.state}</p>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(addr.address_id)}>
              Remove
            </button>
          </div>
        ))
      )}
      <button className="btn btn-primary">Add New Address</button>
    </div>
  );
};

export default Addresses;
