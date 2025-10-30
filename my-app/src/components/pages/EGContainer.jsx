import React, { useState, useEffect } from "react";
import "./egcontainer.css"; // ✅ Same modern grid/card style as Book.jsx

// 🖼️ Helper for image source
const getImageSrc = (imgData) => {
  if (!imgData) return "placeholder.png";
  if (imgData.startsWith("data:")) return imgData;
  return `http://localhost:5000/${imgData}`; // Matches other product pages
};

const EgContainer = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [cartMessage, setCartMessage] = useState("");
  const [newContainers, setNewContainers] = useState([]);
  const [oldContainers, setOldContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch EG Containers by category
  const fetchEgContainers = async () => {
    setLoading(true);
    try {
      // Make sure backend supports /api/products/egcontainer
      const response = await fetch("http://localhost:5000/api/products/egcontainer");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      console.log("Fetched EG Containers:", data);

      // ✅ Separate by condition
      setNewContainers(data.filter((p) => p.condition === "new"));
      setOldContainers(data.filter((p) => p.condition === "used"));
    } catch (err) {
      console.error("Error fetching EG Containers:", err);
      setError("Failed to fetch EG Containers");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-refresh when new product is published
  useEffect(() => {
    fetchEgContainers();

    const handleNewProduct = () => {
      console.log("Detected new EG container, refetching...");
      fetchEgContainers();
    };

    window.addEventListener("newProductPublished", handleNewProduct);
    return () => window.removeEventListener("newProductPublished", handleNewProduct);
  }, []);

  // ✅ Add to Cart logic
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

  // ✅ Decide which set to show
  const displayed = activeTab === "new" ? newContainers : oldContainers;

  if (loading) return <p>Loading EG Containers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="egcontainer-page">
      {/* 🛒 Floating Cart */}
      <div className="cart-icon">
        <span className="cart-count">
          {cart.reduce((acc, item) => acc + item.quantity, 0)}
        </span>
        <img src="cart-icon.png" alt="Cart" />
      </div>

      {/* 🔘 Tabs */}
      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          🆕 New Containers
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          ♻️ Used Containers
        </button>
      </div>

      {/* 🧾 Product Cards */}
      <div className="eg-grid">
        {displayed.length > 0 ? (
          displayed.map((item) => (
            <div key={item._id} className="eg-card">
              <img
                src={item.images?.[0] ? getImageSrc(item.images[0]) : "placeholder.png"}
                alt={item.title || item.name}
                className="eg-image"
              />
              <h3>{item.title || item.name}</h3>
              <p className="price">₹{item.price}</p>
              <button className="add-btn" onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No {activeTab} containers available.</p>
        )}
      </div>

      {/* ✅ Floating Add Message */}
      {cartMessage && <div className="cart-message">{cartMessage}</div>}
    </div>
  );
};

export default EgContainer;
