import React, { useState, useEffect } from "react";
// import { MdFavoriteBorder, MdFavorite } from "react-icons/md"; // Removed this import as it's causing an error
import "./labcoat.css"
// 🖼 Helper function for safe Base64 image handling
const getImageSrc = (imgData) => {
  if (!imgData) return "https://placehold.co/250x250/eee/aaa?text=No+Image";
  if (imgData.startsWith("data:")) return imgData;
  // Assuming it's raw Base64, prepend the scheme
  return `data:image/jpeg;base64,${imgData}`;
};

const Labcoat = () => {
  const [activeTab, setActiveTab] = useState("new");

  // --- CART & FAVORITES LOGIC ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem("favorites");
    return savedFavs ? JSON.parse(savedFavs) : [];
  });
  const [cartMessage, setCartMessage] = useState("");
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- SERVER DATA STATE ---
  const [newLabCoats, setNewLabCoats] = useState([]);
  const [oldLabCoats, setOldLabCoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🧑‍🔬 Function to fetch lab coats
  const fetchLabCoats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint matches server.js
      const response = await fetch("http://localhost:5000/api/products/labcoats");
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json(); // Expects a single array
      console.log("Fetched lab coats:", data);

      // --- Split data into new/old ---
      const newCoats = data.filter(coat => coat.condition === 'new');
      const oldCoats = data.filter(coat => coat.condition !== 'new');

      setNewLabCoats(newCoats);
      setOldLabCoats(oldCoats);

    } catch (err) {
      console.error("Error fetching lab coats:", err);
      setError("Failed to load lab coats. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- useEffect to fetch and listen ---
  useEffect(() => {
    // 1. Initial Load
    fetchLabCoats();

    // 2. Setup Event Listener
    const handleProductUpdate = () => {
      console.log("New product published, re-fetching lab coat list...");
      fetchLabCoats();
    };
    window.addEventListener('newProductPublished', handleProductUpdate);

    // 3. Cleanup
    return () => {
      window.removeEventListener('newProductPublished', handleProductUpdate);
    };
  }, []); // Runs once on mount

  // 🛍 Add to cart
  const addToCart = (item) => {
    const existingProduct = cart.find((cartItem) => cartItem.id === item._id);
    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, id: item._id, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setCartMessage(`'${item.title}' has been added to your cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  // ❤️ Toggle Favorite
  const toggleFavorite = (item) => {
    const isFav = favorites.some((fav) => fav.id === item._id);
    let updatedFavs;

    if (isFav) {
      updatedFavs = favorites.filter((fav) => fav.id !== item._id);
    } else {
      // Add the item, mapping _id to id for consistency in favorites list
      updatedFavs = [...favorites, { ...item, id: item._id }];
    }

    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="labcoat-page" style={{ padding: '20px', textAlign: 'center' }}>
        <p className="no-products-message">Loading lab coats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="labcoat-page" style={{ padding: '20px', textAlign: 'center' }}>
        <p className="no-products-message" style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  const displayedItems = activeTab === "new" ? newLabCoats : oldLabCoats;

  return (
    <>
   

      <div className="labcoat-page">
        {/* Cart Icon */}
        <div className="cart-icon">
          <span className="cart-count">{cartCount}</span>
          {/* Using a placeholder for the cart icon */}
          <img src="https://placehold.co/30x30/eee/aaa?text=🛒" alt="Cart" />
        </div>

        {/* Tabs */}
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
            🧑‍🔬 Old Lab Coats
          </button>
        </div>

        {/* Products Grid */}
        <div className="labcoat-container">
          {displayedItems.length > 0 ? (
            displayedItems.map((item) => {
              const isFav = favorites.some((fav) => fav.id === item._id);
              return (
                <div className="labcoat-card" key={item._id}>
                  <div className="product-image-container">
                    <img
                      src={
                        item.images && item.images.length
                          ? getImageSrc(item.images[0])
                          : "https://placehold.co/250x250/eee/aaa?text=No+Image"
                      }
                      alt={item.title}
                      className="labcoat-image"
                      onError={(e) => { e.target.src = 'https://placehold.co/250x250/eee/aaa?text=No+Image'; }}
                    />
                    {/* --- FIX: Replaced icons with Emojis --- */}
                    <button
                      className="fav-btn"
                      onClick={() => toggleFavorite(item)}
                      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      {isFav ? (
                        <span className="fav-icon filled">❤️</span>
                      ) : (
                        <span className="fav-icon">♡</span>
                      )}
                    </button>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="price">₹{parseFloat(item.price).toFixed(2)}</p>
                  <button className="add-btn" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              );
            })
          ) : (
            <p className="no-products-message">
              No {activeTab} lab coats available yet.
            </p>
          )}
        </div>

        {/* Cart Message */}
        {cartMessage && <div className="cart-message">{cartMessage}</div>}
      </div>
    </>
  );
};

export default Labcoat;