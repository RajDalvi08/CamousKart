import React, { useState, useEffect } from "react";
import "./egcontainer.css"; // Using external CSS file

// 🖼 Helper function for safe Base64 image handling
const getImageSrc = (imgData) => {
  if (!imgData) return "https://placehold.co/150x200/eee/ccc?text=No+Image";
  if (imgData.startsWith("data:")) return imgData;
  return `data:image/jpeg;base64,${imgData}`;
};

const EGContainer = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // --- Pop-up message state ---
  const [cartMessage, setCartMessage] = useState("");

  // --- Server data states (like Book.jsx) ---
  const [newItems, setNewItems] = useState([]);
  const [oldItems, setOldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ✅ MODIFIED: Fetch products (async/await pattern)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // This endpoint is from your original file
      const response = await fetch("http://localhost:5000/api/products/EgContainer");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched EG Containers/Gadgets:", data);

      // Split data into new and old
      const freshItems = data.filter(item => item.condition === 'new');
      const usedItems = data.filter(item => item.condition !== 'new');

      setNewItems(freshItems);
      setOldItems(usedItems);

    } catch (err) {
      console.error("Error fetching gadgets:", err);
      setError("Failed to load gadgets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ MODIFIED: useEffect to fetch and listen
  useEffect(() => {
    fetchProducts();
    const handleProductUpdate = () => {
      console.log("New product published, re-fetching EG Container list...");
      fetchProducts();
    };
    window.addEventListener('newProductPublished', handleProductUpdate);
    return () => {
      window.removeEventListener('newProductPublished', handleProductUpdate);
    };
  }, []); 

  // ✅ MODIFIED: Add to cart (uses message, not alert)
  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item._id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((i) =>
        i.id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1, id: item._id }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Set message instead of alert
    setCartMessage(`'${item.title || item.name}' has been added to your cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="egcontainer-page">
        <p className="loading-text">Loading Gadgets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="egcontainer-page">
        <p className="loading-text">{error}</p>
      </div>
    );
  }

  const displayedItems = activeTab === "new" ? newItems : oldItems;

  return (
    <div className="egcontainer-page">
      {/* Cart Icon */}
      <div className="cart-icon">
        <span className="cart-count">{cartCount}</span>
        <img src="/cart-icon.png" alt="Cart" style={{ width: '24px', height: '24px' }} />
      </div>

      {/* Tabs */}
      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
           New Containers
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
           Used Containers
        </button>
      </div>

      {/* Gadget Grid */}
      <div className="eg-container">
        {displayedItems.length > 0 ? (
          displayedItems.map((gadget) => (
            <div className="eg-card" key={gadget._id}>
              <img
                src={getImageSrc(gadget.images?.length ? gadget.images[0] : "")}
                alt={gadget.title || gadget.name}
                className="eg-image"
              />
              <h3>{gadget.title || gadget.name}</h3>
              <p className="price">₹{gadget.price}</p>
              <button className="add-btn" onClick={() => addToCart(gadget)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="loading-text">
            No {activeTab} gadgets found.
          </p>
        )}
      </div>
      
      {/* Cart Message */}
      {cartMessage && <div className="cart-message">{cartMessage}</div>}
    </div>
  );
};

export default EGContainer;
