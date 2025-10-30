import React, { useState, useEffect } from "react";
import "./labcoat.css";

// 🖼 Proper image resolver (same as Book.jsx)
const getImageSrc = (imgData) => {
  if (!imgData) return "https://placehold.co/200x200?text=No+Image";
  if (imgData.startsWith("data:")) return imgData;
  if (imgData.startsWith("/uploads/") || imgData.startsWith("uploads/"))
    return `http://localhost:5000/${imgData.replace(/^\//, "")}`;
  return `http://localhost:5000/uploads/${imgData}`;
};

const Labcoat = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [cartMessage, setCartMessage] = useState("");
  const [newCoats, setNewCoats] = useState([]);
  const [usedCoats, setUsedCoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch lab coats by category
  const fetchLabCoats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products/category/labcoat");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      console.log("Fetched lab coats:", data);

      // Separate new and used
      setNewCoats(data.filter((p) => p.condition === "new"));
      setUsedCoats(data.filter((p) => p.condition === "used"));
    } catch (err) {
      console.error("Error fetching lab coats:", err);
      setError("Failed to fetch lab coats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabCoats();

    const handleNewProduct = () => {
      console.log("New lab coat detected, refetching...");
      fetchLabCoats();
    };
    window.addEventListener("newProductPublished", handleNewProduct);

    return () => window.removeEventListener("newProductPublished", handleNewProduct);
  }, []);

  // ✅ Cart logic
  const addToCart = (product) => {
    const existing = cart.find((i) => i._id === product._id);
    const updated = existing
      ? cart.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    setCartMessage(`'${product.title || product.name}' added to cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  // ❤️ Favorite toggle
  const toggleFavorite = (item) => {
    const isFav = favorites.some((f) => f._id === item._id);
    const updated = isFav
      ? favorites.filter((f) => f._id !== item._id)
      : [...favorites, item];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const displayed = activeTab === "new" ? newCoats : usedCoats;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <p>Loading lab coats...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="labcoat-page">
      {/* 🛒 Floating Cart */}
      <div className="cart-icon">
        <img src="/cart-icon.png" alt="Cart" />
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </div>

      {/* 🔘 Tabs */}
      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          🧑‍🔬 New Lab Coats
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          ♻️ Used Lab Coats
        </button>
      </div>

      {/* 🧾 Product Grid */}
      <div className="labcoat-grid">
        {displayed.length > 0 ? (
          displayed.map((item) => {
            const isFav = favorites.some((f) => f._id === item._id);
            return (
              <div className="labcoat-card" key={item._id}>
                <div className="img-wrapper">
                  <img
                    src={getImageSrc(item.images?.[0])}
                    alt={item.title || "Lab Coat"}
                    className="labcoat-image"
                  />
                  <button
                    className={`fav-btn ${isFav ? "active" : ""}`}
                    onClick={() => toggleFavorite(item)}
                  >
                    {isFav ? "❤️" : "♡"}
                  </button>
                </div>
                <h3>{item.title || "Lab Coat"}</h3>
                <p className="price">₹{item.price}</p>
                <button className="add-btn" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            );
          })
        ) : (
          <p>No {activeTab} lab coats available.</p>
        )}
      </div>

      {/* ✅ Floating message */}
      {cartMessage && <div className="cart-message">{cartMessage}</div>}
    </div>
  );
};

export default Labcoat;
