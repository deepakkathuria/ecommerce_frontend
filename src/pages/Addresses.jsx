import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const Addresses = () => {
  const { orderId } = useParams(); // Extract orderId from URL
  const [address, setAddress] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Toggle form

  // Refs for form inputs
  const fullNameRef = useRef();
  const phoneNumberRef = useRef();
  const streetAddressRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const postalCodeRef = useRef();
  const countryRef = useRef();

  useEffect(() => {
    fetchAddress();
  }, [orderId]);

  const fetchAddress = async () => {
    const token = localStorage.getItem("apitoken");
    if (!token || !orderId) return;

    try {
      const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/${orderId}/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setAddress(data.address || null); // Ensure it handles missing address
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleRemove = async () => {
    const token = localStorage.getItem("apitoken");
    if (!token || !address) return;

    try {
      const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/address/${address.address_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAddress(null);
      }
    } catch (error) {
      console.error("Error removing address:", error);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const token = localStorage.getItem("apitoken");
    if (!token || !orderId) return;

    const updatedAddress = {
      full_name: fullNameRef.current.value,
      phone_number: phoneNumberRef.current.value,
      street_address: streetAddressRef.current.value,
      city: cityRef.current.value,
      state: stateRef.current.value,
      postal_code: postalCodeRef.current.value,
      country: countryRef.current.value,
    };

    try {
      let response;
      if (address) {
        response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/address/${address.address_id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAddress),
        });
      } else {
        response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/orders/${orderId}/address`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAddress),
        });
      }

      if (response.ok) {
        setAddress(updatedAddress); // Update state
        setIsAdding(false); // Hide form after saving
        fetchAddress(); // Refresh the address data
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div>
      <h4>Address</h4>
      {address ? (
        <div className="mb-3">
          <p><strong>{address.full_name}</strong></p>
          <p>{address.street_address}, {address.city}, {address.state}, {address.postal_code}, {address.country}</p>
          <p>Phone: {address.phone_number}</p>
          <button className="btn btn-outline-danger btn-sm" onClick={handleRemove}>Remove</button>
        </div>
      ) : (
        <p>No address found for this order.</p>
      )}

      {/* Add/Update Address Form */}
      {isAdding ? (
        <form onSubmit={handleSaveAddress} className="mt-3">
          <input type="text" ref={fullNameRef} className="form-control mb-2" placeholder="Full Name" defaultValue={address?.full_name} required />
          <input type="text" ref={phoneNumberRef} className="form-control mb-2" placeholder="Phone Number" defaultValue={address?.phone_number} required />
          <input type="text" ref={streetAddressRef} className="form-control mb-2" placeholder="Street Address" defaultValue={address?.street_address} required />
          <input type="text" ref={cityRef} className="form-control mb-2" placeholder="City" defaultValue={address?.city} required />
          <input type="text" ref={stateRef} className="form-control mb-2" placeholder="State" defaultValue={address?.state} required />
          <input type="text" ref={postalCodeRef} className="form-control mb-2" placeholder="Postal Code" defaultValue={address?.postal_code} required />
          <input type="text" ref={countryRef} className="form-control mb-2" placeholder="Country" defaultValue={address?.country} required />
          <button type="submit" className="btn btn-success">{address ? "Update Address" : "Save Address"}</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsAdding(false)}>Cancel</button>
        </form>
      ) : (
        <button className="btn btn-primary mt-3" onClick={() => setIsAdding(true)}>
          {address ? "Update Address" : "Add New Address"}
        </button>
      )}
    </div>
  );
};

export default Addresses;
