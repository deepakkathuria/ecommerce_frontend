import React from "react";

const UserDetails = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  };

  return (
    <div>
      <h4>User Details</h4>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
      <button className="btn btn-primary">Edit Details</button>
    </div>
  );
};

export default UserDetails;
