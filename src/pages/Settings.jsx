import React, { useState } from "react";

const Settings = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("apitoken");

    try {
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/auth/change-password", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      setMessage(data.message);
      
      if (response.ok) {
        setOldPassword("");
        setNewPassword("");
        setShowChangePassword(false); // Hide form after success
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Failed to update password.");
    }
  };

  return (
    <div>
      <h4>Settings</h4>

      {/* Change Password Button */}
      {!showChangePassword ? (
        <button className="btn btn-warning" onClick={() => setShowChangePassword(true)}>
          Change Password
        </button>
      ) : (
        // Change Password Form
        <form onSubmit={handleChangePassword} className="mt-3">
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-2"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success">Update Password</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowChangePassword(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Success/Error Message */}
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default Settings;
