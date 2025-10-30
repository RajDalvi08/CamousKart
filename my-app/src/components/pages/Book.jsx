import React, { useState, useEffect } from "react";
import "./book.css";

const getImageSrc = (imgData) => {
  if (!imgData) return "placeholder.png";
  if (imgData.startsWith("data:")) return imgData;
  return `http://localhost:5000/${imgData}`; // 👈 Serve uploaded image path
};

const Book = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [cartMessage, setCartMessage] = useState("");
  const [newBooks, setNewBooks] = useState([]);
  const [oldBooks, setOldBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch books by category (same pattern as Calculator.jsx)
  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Assuming your backend route filters category by lowercase
      const response = await fetch("http://localhost:5000/api/products/category/books");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      console.log("Fetched books:", data);

      // ✅ Separate new and old (used) books
      setNewBooks(data.filter((b) => b.condition === "new"));
      setOldBooks(data.filter((b) => b.condition === "used"));
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto refresh when new book added from Sell.jsx
  useEffect(() => {
    fetchBooks();

    const handleNewProduct = () => {
      console.log("New book detected, refetching...");
      fetchBooks();
    };

    window.addEventListener("newProductPublished", handleNewProduct);

    return () => {
      window.removeEventListener("newProductPublished", handleNewProduct);
    };
  }, []);

  // ✅ Cart handling (same logic as Calculator.jsx)
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

  const displayed = activeTab === "new" ? newBooks : oldBooks;

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-page">
      {/* 🛒 Cart Icon */}
      <div className="cart-icon">
        <span className="cart-count">
          {cart.reduce((acc, item) => acc + item.quantity, 0)}
        </span>
        <img src="cart-icon.png" alt="Cart" />
      </div>

      {/* 📚 Tabs */}
      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          📚 New Books
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          📖 Old Books
        </button>
      </div>

      {/* 📦 Book Listing */}
      <div className="book-container">
        {displayed.length > 0 ? (
          displayed.map((book) => (
            <div key={book._id} className="book-card">
              <img
                src={book.images?.[0] ? getImageSrc(book.images[0]) : "placeholder.png"}
                alt={book.title || book.name}
                className="book-image"
              />
              <h3>{book.title || book.name}</h3>
              <p className="price">₹{book.price}</p>
              <button className="add-btn" onClick={() => addToCart(book)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No {activeTab} books available.</p>
        )}
      </div>

      {cartMessage && <div className="cart-message">{cartMessage}</div>}
    </div>
  );
};

export default Book;
