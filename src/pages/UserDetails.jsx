import React, { useEffect, useState } from "react";

const UserDetails = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("apitoken");
      if (!token) return;

      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
          setUpdatedUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;

    try {
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div>
      <h4>User Details</h4>
      {isEditing ? (
        <>
          <input
            type="text"
            className="form-control mb-2"
            value={updatedUser.name}
            onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
          />
          <input
            type="email"
            className="form-control mb-2"
            value={updatedUser.email}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleUpdate}>
            Save Changes
          </button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Details
          </button>
        </>
      )}
    </div>
  );
};

export default UserDetails;
