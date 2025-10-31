import React, { useState, useEffect } from "react";
import "./drafter.css";

const getImageSrc = (imgData) => {
  if (!imgData) return "placeholder.png";
  if (imgData.startsWith("data:")) return imgData;
  return `http://localhost:5000/${imgData}`; // 👈 Match Calculator.jsx logic
};

const Drafter = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [cartMessage, setCartMessage] = useState("");
  const [newDrafters, setNewDrafters] = useState([]);
  const [oldDrafters, setOldDrafters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Drafters by Category (same pattern as Calculator.jsx)
  const fetchDrafters = async () => {
    setLoading(true);
    try {
      // Make sure backend supports /api/products/category/drafters
      const response = await fetch("http://localhost:5000/api/products/category/drafters");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      console.log("Fetched drafters:", data);

      // ✅ Separate by condition
      setNewDrafters(data.filter((d) => d.condition === "new"));
      setOldDrafters(data.filter((d) => d.condition === "used"));
    } catch (err) {
      console.error("Error fetching drafters:", err);
      setError("Failed to fetch drafters");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Re-fetch when new product is published
  useEffect(() => {
    fetchDrafters();

    const handleNewProduct = () => {
      console.log("New product detected, refetching drafters...");
      fetchDrafters();
    };

    window.addEventListener("newProductPublished", handleNewProduct);

    return () => {
      window.removeEventListener("newProductPublished", handleNewProduct);
    };
  }, []);

  // ✅ Add to Cart (same as Calculator.jsx)
  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);
    const updated = existing
      ? cart.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...cart, { ...item, quantity: 1 }];

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    setCartMessage(`'${item.title || item.name}' added to cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  const displayed = activeTab === "new" ? newDrafters : oldDrafters;

  if (loading) return <p>Loading drafters...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="drafter-page">
      {/* 🛒 Cart Icon */}
      
      <div className="cart-icon">
        <span className="cart-count">
          
        </span>
      
      </div>

      {/* 🔘 Tabs */}
      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          ✏️ New Drafters
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          🧾 Used Drafters
        </button>
      </div>

      {/* 📦 Drafter Cards */}
      <div className="drafter-container">
        {displayed.length > 0 ? (
          displayed.map((drafter) => (
            <div key={drafter._id} className="drafter-card">
              <img
                src={drafter.images?.[0] ? getImageSrc(drafter.images[0]) : "placeholder.png"}
                alt={drafter.title || drafter.name}
                className="drafter-image"
              />
              <h3>{drafter.title || drafter.name}</h3>
              <p className="price">₹{drafter.price}</p>
              <button className="add-btn" onClick={() => addToCart(drafter)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No {activeTab} drafters available.</p>
        )}
      </div>

      {cartMessage && <div className="cart-message">{cartMessage}</div>}
    </div>
  );
};

export default Drafter;
