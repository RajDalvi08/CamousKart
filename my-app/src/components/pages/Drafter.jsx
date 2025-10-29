import React, { useState, useEffect } from "react";
import "./drafter.css";
// 🖼 Helper function for safe Base64 image handling
const getImageSrc = (imgData) => {
  if (!imgData) return "placeholder.png";
  if (imgData.startsWith("data:")) return imgData;
  return `data:image/jpeg;base64,${imgData}`;
};

const Drafter = () => {
  const [activeTab, setActiveTab] = useState("new");

  // --- CART LOGIC ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartMessage, setCartMessage] = useState("");
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- SERVER DATA STATE ---
  const [newDrafters, setNewDrafters] = useState([]);
  const [oldDrafters, setOldDrafters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🖊️ NEW: Function to fetch drafters
  const fetchDrafters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/products/drafters");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Expects a single array
      console.log("Fetched drafters:", data);

      // --- Split data ---
      const newItems = data.filter(item => item.condition === 'new');
      const oldItems = data.filter(item => item.condition !== 'new');

      setNewDrafters(newItems);
      setOldDrafters(oldItems);

    } catch (err) {
      console.error("Error fetching drafters:", err);
      setError("Failed to load drafters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- useEffect to fetch and listen ---
  useEffect(() => {
    // 1. Initial Load from server
    fetchDrafters();

    // 2. Setup Custom Event Listener
    const handleProductUpdate = () => {
      console.log("New product published, re-fetching drafter list...");
      fetchDrafters();
    };

    window.addEventListener('newProductPublished', handleProductUpdate);

    // 3. Cleanup: Remove the listener
    return () => {
      window.removeEventListener('newProductPublished', handleProductUpdate);
    };
  }, []); // Empty array ensures this runs only once on mount

  // 🛍 Add to cart
  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setCartMessage(`'${item.name}' has been added to your cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return <div className="drafter-page"><p className="no-drafters">Loading drafters...</p></div>;
  }

  if (error) {
    return <div className="drafter-page"><p className="no-drafters">{error}</p></div>;
  }

  const displayedDrafters = activeTab === "new" ? newDrafters : oldDrafters;

  return (
    <>
      
      

      <div className="drafter-page">
        {/* 🛒 Cart Icon and Count */}
        <div className="cart-icon">
          <span className="cart-count">{cartCount}</span>
          <img src="cart-icon.png" alt="Cart" />
        </div>

        {/* 🔘 Tabs */}
        <div className="button-group">
          <button
            className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
            onClick={() => setActiveTab("new")}
          >
            🖊️ New Drafters
          </button>
          <button
            className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
            onClick={() => setActiveTab("old")}
          >
            🖊️ Used Drafters
          </button>
        </div>

        {/* 🧾 Drafters Grid */}
        <div className="drafter-container">
          {displayedDrafters.length > 0 ? (
            displayedDrafters.map((item) => (
              <div className="drafter-card" key={item.id}>
                <img
                  src={
                    item.img
                      ? getImageSrc(item.img)
                      : "placeholder.png"
                  }
                  alt={item.name}
                  className="drafter-image"
                />
                <h3>{item.name}</h3>
                <p className="price">₹{parseFloat(item.price).toFixed(2)}</p>
                <button className="add-btn" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="no-drafters">
              No {activeTab} drafters available yet.
            </p>
          )}
        </div>

        {/* 🧾 Cart Message */}
        {cartMessage && <div className="cart-message">{cartMessage}</div>}
      </div>
    </>
  );
};

export default Drafter;
