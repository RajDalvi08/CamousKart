import React, { useState, useEffect } from "react";
import "./calculator.css";
// import "./calculator.css"; // Removed to prevent compilation errors
// import { useLocation } from "react-router-dom"; // No longer needed

// 🖼 Helper function for safe Base64 image handling
const getImageSrc = (imgData) => {
 if (!imgData) return "placeholder.png";
if (imgData.startsWith("data:")) return imgData;
 return `data:image/jpeg;base64,${imgData}`;
};

const Calculator = () => {
const [activeTab, setActiveTab] = useState("new");

  // --- CART LOGIC (Unchanged from your version) ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartMessage, setCartMessage] = useState("");
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- NEW SERVER DATA STATE (Pattern from Book.jsx) ---
  const [newCalculators, setNewCalculators] = useState([]);
  const [oldCalculators, setOldCalculators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🧮 NEW: Function to fetch calculators (Pattern from Book.jsx)
  const fetchCalculators = async () => {
    setLoading(true);
    setError(null);
    try {
      // --- FIX: Corrected the URL to match server.js ---
      const response = await fetch("http://localhost:5000/api/products/calculators");
      
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Expects a single array
      console.log("Fetched calculators:", data);

      // --- Split data just like Book.jsx's logic ---
      // (Book.jsx gets this from the server, we do it here)
      const newCalcs = data.filter(calc => calc.condition === 'new');
      const oldCalcs = data.filter(calc => calc.condition !== 'new');

      setNewCalculators(newCalcs);
      setOldCalculators(oldCalcs);

    } catch (err) {
      console.error("Error fetching calculators:", err);
      setError("Failed to load calculators. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- MODIFIED: useEffect to fetch and listen (Pattern from Book.jsx) ---
  useEffect(() => {
    // 1. Initial Load from server
    fetchCalculators();

    // 2. Setup Custom Event Listener
    // This listens for the event from Sell.jsx
    const handleProductUpdate = () => {
      console.log("New product published, re-fetching calculator list...");
      fetchCalculators();
    };

    window.addEventListener('newProductPublished', handleProductUpdate);

    // 3. Cleanup: Remove the listener
    return () => {
      window.removeEventListener('newProductPublished', handleProductUpdate);
    };
  }, []); // Empty array ensures this runs only once on mount

  // 🛍 Add to cart (Unchanged from your version)
  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item._id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((i) =>
        i.id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cart, { ...item, id: item._id, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setCartMessage(`'${item.title || item.name}' has been added to your cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  // --- RENDER LOGIC ---

  // NEW: Handle Loading and Error states (Pattern from Book.jsx)
  if (loading) {
    return <div className="calculator-page"><p className="no-calculators">Loading calculators...</p></div>;
  }

  if (error) {
    return <div className="calculator-page"><p className="no-calculators">{error}</p></div>;
  }

  // --- MODIFIED: Use the new state variables (Pattern from Book.jsx) ---
  const displayedCalculators = activeTab === "new" ? newCalculators : oldCalculators;

  return (
    <div className="calculator-page">
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
          🧮 New Calculators
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
Â         onClick={() => setActiveTab("old")}
        >
          🔢 Old Calculators
        </button>
      </div>

      {/* 🧾 Calculators Grid */}
      <div className="calculator-container">
        {displayedCalculators.length > 0 ? (
          displayedCalculators.map((calc) => (
            <div className="calculator-card" key={calc._id}>
              <img
                src={
                  // This part is specific to your calculator data, which is correct
                  calc.images && calc.images.length
                    ? getImageSrc(calc.images[0])
                    : "placeholder.png"
                }
alt={calc.title || calc.name}
className="calculator-image"
 />
<h3>{calc.title || calc.name}</h3>
<p className="price">₹{parseFloat(calc.price).toFixed(2)}</p>
 <button className="add-btn" onClick={() => addToCart(calc)}>
 Add to Cart
 </button>
 </div>
))
 ) : (
 <p className="no-calculators">
 No {activeTab} calculators available yet.
</p>
)}
</div>

 {/* 🧾 Cart Message */}
 {cartMessage && <div className="cart-message">{cartMessage}</div>}
 </div>
 );
};

export default Calculator;