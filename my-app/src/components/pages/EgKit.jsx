import React, { useState, useEffect } from "react";
import "./book.css"; // Use same styling as Book.jsx for consistency

const EgKit = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartMessage, setCartMessage] = useState("");
  const [products, setProducts] = useState([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/egkit");
        const data = await res.json();
        console.log("Fetched EgKit products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching EgKit products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setCartMessage(`'${product.title}' added to cart!`);
    setTimeout(() => setCartMessage(""), 2000);
  };

  const displayedProducts = products.filter((p) =>
    activeTab === "new" ? p.condition === "new" : p.condition !== "new"
  );

  return (
    <div className="book-page">
      {/* 🛒 Cart Icon */}
      <div className="cart-icon">
        <span className="cart-count">{cartCount}</span>
        <img src="/cart-icon.png" alt="Cart" className="cart-img" />
      </div>

      {/* 🔘 Tabs */}
      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          🧪 New EgKits
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          🔬 Used EgKits
        </button>
      </div>

      {/* 🧩 Product Grid */}
      <div className="book-container">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div key={product._id} className="book-card">
              <img
                src={
                  product.images?.length
                    ? `http://localhost:5000/${product.images[0]}`
                    : "https://placehold.co/150x200?text=No+Image"
                }
                alt={product.title}
                className="book-image"
              />
              <h3>{product.title}</h3>
              <p className="price">₹{product.price}</p>
              <button className="add-btn" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="loading-text">
            No {activeTab === "new" ? "new" : "used"} EgKits found.
          </p>
        )}
      </div>

      {/* ✅ Cart Notification */}
      {cartMessage && <div className="cart-message">{cartMessage}</div>}
    </div>
  );
};

export default EgKit;
