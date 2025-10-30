import React, { useState, useEffect } from "react";
import "./calculator.css";

const getImageSrc = (imgData) => {
  if (!imgData) return "placeholder.png";
  if (imgData.startsWith("data:")) return imgData;
  return `http://localhost:5000/${imgData}`; // 👈 Serve uploaded image
};

const Calculator = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [cartMessage, setCartMessage] = useState("");
  const [newCalculators, setNewCalculators] = useState([]);
  const [oldCalculators, setOldCalculators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalculators = async () => {
    setLoading(true);
    try {
      // This URL is correct, assuming you fixed Sell.jsx to save the category as lowercase
      const response = await fetch("http://localhost:5000/api/products/category/calculators");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      console.log("Fetched calculators:", data);
      setNewCalculators(data.filter((c) => c.condition === "new"));
      
      // --- FIX 1 ---
      // Changed "old" to "used" to match the data saved from Sell.jsx
      setOldCalculators(data.filter((c) => c.condition === "used"));
    } catch (err) {
      setError("Failed to fetch calculators");
    } finally {
      setLoading(false);
    }
  };

  // --- FIX 2 ---
  // Updated useEffect to listen for new products and refetch data
  useEffect(() => {
    // 1. Fetch data on initial load
    fetchCalculators();

    // 2. Define a function to handle the event
    const handleNewProduct = () => {
      console.log("New product detected, refetching calculators...");
      fetchCalculators();
    };

    // 3. Listen for the custom event from Sell.jsx
    window.addEventListener("newProductPublished", handleNewProduct);

    // 4. Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("newProductPublished", handleNewProduct);
    };
  }, []); // The empty array [] ensures this setup only runs once

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);
    const updated = existing
      ? cart.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...cart, { ...item, quantity: 1 }];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartMessage(`'${item.title}' added to cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  const displayed = activeTab === "new" ? newCalculators : oldCalculators;

  if (loading) return <p>Loading calculators...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="calculator-page">
      <div className="cart-icon">
        <span className="cart-count">
          {cart.reduce((acc, item) => acc + item.quantity, 0)}
        </span>
        <img src="cart-icon.png" alt="Cart" />
      </div>

      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          🧮 New Calculators
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          {/* You can keep this label as "Old" for the user interface */}
          🔢 Old Calculators 
        </button>
      </div>

      <div className="calculator-container">
        {displayed.length > 0 ? (
          displayed.map((calc) => (
            <div key={calc._id} className="calculator-card">
              <img
                src={calc.images?.[0] ? getImageSrc(calc.images[0]) : "placeholder.png"}
                alt={calc.title}
                className="calculator-image"
              />
              <h3>{calc.title}</h3>
              <p className="price">₹{calc.price}</p>
              <button className="add-btn" onClick={() => addToCart(calc)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No {activeTab} calculators available.</p>
        )}
      </div>

      {cartMessage && <div className="cart-message">{cartMessage}</div>}
    </div>
  );
};

export default Calculator;