import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom"; // No longer needed
// import "./EgKit.css"; // CSS is now embedded below

// 🖼 Helper function for safe Base64 image handling
const getImageSrc = (imgData) => {
  if (!imgData) return "https://placehold.co/150x200/eee/ccc?text=No+Image";
  if (imgData.startsWith("data:")) return imgData;
  return `data:image/jpeg;base64,${imgData}`;
};

const EgKit = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [cartMessage, setCartMessage] = useState("");
  const [newKits, setNewKits] = useState([]);
  const [oldKits, setOldKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/products/EgKit");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched EgKits:", data);

      const freshKits = data.filter(kit => kit.condition === 'new');
      const usedKits = data.filter(kit => kit.condition !== 'new');

      setNewKits(freshKits);
      setOldKits(usedKits);

    } catch (err) {
      console.error("Error fetching EgKits:", err);
      setError("Failed to load EG Kits. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const handleProductUpdate = () => {
      console.log("New product published, re-fetching EG Kit list...");
      fetchProducts();
    };
    window.addEventListener('newProductPublished', handleProductUpdate);
    return () => {
      window.removeEventListener('newProductPublished', handleProductUpdate);
    };
  }, []); 

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
    
    setCartMessage(`'${item.title || item.name}' has been added to your cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="egkit-page">
        <p className="loading-text">Loading EG Kits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="egkit-page">
        <p className="loading-text">{error}</p>
      </div>
    );
  }

  const displayedKits = activeTab === "new" ? newKits : oldKits;

  return (
    <>
      {/* Styles embedded from Book.jsx, adapted for EgKit.jsx */}
      <style>{`
        .egkit-page {
          padding: 10px;
          background-color: #fefefe;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }

        /* Cart Icon */
        .cart-icon {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #fff;
          border-radius: 50%;
          padding: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        
        .cart-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        /* Button Group */
        .button-group {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
          margin-top: 20px; /* Added margin for cart icon */
        }
        
        .tab-btn {
          background: #ecf0f1;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
        }
        
        .tab-btn:hover {
          background: #dfe6e9;
        }
        
        .tab-btn.active {
          background: #3498db;
          color: #fff;
          box-shadow: 0px 8px 20px rgba(52, 152, 219, 0.4);
        }
        
        /* Products Grid */
        .egkit-container {
          display: flex;
          gap: 100px;
          flex-wrap: wrap;
          justify-content: center;
            background-image: url('https://tse4.mm.bing.net/th/id/OIP.zqvCOZF-t-CX9kvwIze7xwHaE4?pid=Api&P=0&h=180');
          padding-top: 30px;
          padding-bottom: 30px;
        }
        
        .egkit-card {
          background: #fff;
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          box-shadow: 0 10px 20px rgb(30, 121, 102),
                      0 6px 6px rgba(234, 234, 234, 0.975);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width: 250px; /* Standard width */
        }
        
        .egkit-card:hover {
          transform: translateY(-8px);
          box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.15);
        }
        
        .egkit-image {
          width: 150px;
          height: 200px;
          object-fit: cover;
          margin-bottom: 15px;
        }
        
        .egkit-card h3 {
          font-size: 18px;
          font-weight: 600;
          min-height: 48px; /* For 2 lines of text */
        }
        
        .price {
          font-size: 18px;
          font-weight: 600;
          color: #3498db;
          margin: 8px 0;
        }
        
        .add-btn {
          background: #3498db;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 25px;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s ease;
        }
        
        .add-btn:hover {
          background: #217dbb;
        }

        /* Cart Message */
        .cart-message {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #2ecc71; /* Green success */
          color: #fff;
          padding: 12px 20px;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          z-index: 1000;
          font-size: 14px;
          font-weight: 500;
        }

        /* Loading/Error Text */
        .loading-text {
          text-align: center;
          margin-top: 40px;
          font-size: 18px;
          color: #555;
        }
      `}</style>

      <div className="egkit-page">
        {/* 🛒 Cart */}
        <div className="cart-icon">
          <span className="cart-count">{cartCount}</span>
          <img src="/cart-icon.png" alt="Cart" style={{ width: '24px', height: '24px' }} />
        </div>

        {/* 🔘 Tabs */}
        <div className="button-group">
          <button
            className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
            onClick={() => setActiveTab("new")}
          >
            🛠️ New EgKits
          </button>
          <button
            className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
            onClick={() => setActiveTab("old")}
          >
            🧰 Used EgKits
          </button>
        </div>

        {/* 🧩 EgKit Grid */}
        <div className="egkit-container">
          {displayedKits.length > 0 ? (
            displayedKits.map((kit) => (
              <div className="egkit-card" key={kit._id}>
                <img
                  src={getImageSrc(kit.images?.length ? kit.images[0] : "")}
                  alt={kit.title || kit.name}
                  className="egkit-image"
                />
                <h3>{kit.title || kit.name}</h3>
                <p className="price">₹{kit.price}</p>
                <button className="add-btn" onClick={() => addToCart(kit)}>
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="loading-text">
              No {activeTab} EG Kits found.
            </p>
          )}
        </div>
        
        {/* 🧾 Cart Message */}
        {cartMessage && <div className="cart-message">{cartMessage}</div>}
      </div>
    </>
  );
};

export default EgKit;
