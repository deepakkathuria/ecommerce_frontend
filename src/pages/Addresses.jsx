const Addresses = () => {
    const addresses = [
      { id: 1, address: "123 Main St, New York, NY 10001" },
      { id: 2, address: "456 Elm St, San Francisco, CA 94101" },
    ];
  
    return (
      <div>
        <h4>Addresses</h4>
        {addresses.map((addr) => (
          <div key={addr.id} className="mb-3">
            <p>{addr.address}</p>
            <button className="btn btn-outline-danger btn-sm">Remove</button>
          </div>
        ))}
        <button className="btn btn-primary">Add New Address</button>
      </div>
    );
  };
  
  export default Addresses;
  