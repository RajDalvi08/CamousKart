import React, { useState, useEffect } from "react";
import "./book.css";

// Helper function to ensure the Base64 string is a valid Data URL for the <img> tag
const getImageSrc = (imgData) => {
    if (!imgData) {
        return 'placeholder.png'; // Fallback image
    }
    // Check if the data already starts with the Data URL scheme
    if (imgData.startsWith('data:')) {
        return imgData;
    }
    // This is a fallback, but server should always send the full Data URL
    return `data:image/jpeg;base64,${imgData}`;
};

const Book = () => {
    const [activeTab, setActiveTab] = useState("new");
    
    // --- CART LOGIC (Unchanged) ---
    // Cart state is still managed by localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [cartMessage, setCartMessage] = useState(''); 
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // --- NEW SERVER DATA STATE ---
    const [newBooks, setNewBooks] = useState([]); 
    const [oldBooks, setOldBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW: Function to fetch books from the server ---
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch from the server's new endpoint
            const response = await fetch('http://localhost:5000/api/books');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setNewBooks(data.newBooks);
            setOldBooks(data.oldBooks);

        } catch (err) {
            console.error("Failed to fetch books:", err);
            setError("Failed to load books. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // --- MODIFIED: useEffect to fetch data on load and listen for updates ---
    useEffect(() => {
        // 1. Initial Load from server
        fetchBooks();

        // 2. Setup Custom Event Listener
        // This listens for the event from Sell.jsx
        // It triggers a *re-fetch* from the server to get the new list.
        const handleProductUpdate = () => {
            console.log("New product published, re-fetching book list...");
            fetchBooks();
        };
        
        window.addEventListener('newProductPublished', handleProductUpdate);

        // 3. Cleanup: Remove the listener
        return () => {
            window.removeEventListener('newProductPublished', handleProductUpdate);
        };
    }, []); // Empty array ensures this runs only once on mount


    // --- CART FUNCTIONS (Unchanged) ---
    const addToCart = (item) => {
        const existingProduct = cart.find((cartItem) => cartItem.id === item.id);
        let updatedCart;
        const price = parseFloat(item.price); 

        if (existingProduct) {
            updatedCart = cart.map((cartItem) =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        } else {
            updatedCart = [...cart, { ...item, price, quantity: 1 }];
        }
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartMessage(`'${item.name}' has been added to your cart!`);
        setTimeout(() => setCartMessage(''), 3000);
    };

    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // --- RENDER LOGIC ---
    
    // NEW: Handle Loading and Error states
    if (loading) {
        return <div className="books-page"><p className="no-books">Loading books...</p></div>;
    }

    if (error) {
        return <div className="books-page"><p className="no-books">{error}</p></div>;
    }

    const displayedBooks = activeTab === "new" ? newBooks : oldBooks;

    return (
        <div className="books-page">
            {/* Cart Icon and Count */}
            <div className="cart-icon">
                <span className="cart-count">{cartCount}</span>
                <img src="cart-icon.png" alt="Cart" />
            </div>

            {/* Tab Buttons */}
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

            {/* Books Grid */}
            <div className="book-container">
                {displayedBooks.length > 0 ? (
                    displayedBooks.map((book) => (
                        <div className="book-card" key={book.id}>
                            <img 
                                src={getImageSrc(book.img)} // Correctly handles Base64
                                alt={book.name} 
                                className="book-image" 
                            />
                            <h3>{book.name}</h3>
                            <p className="price">₹{parseFloat(book.price).toFixed(2)}</p>
                            <button
                                className="add-btn"
                                onClick={() => addToCart(book)} 
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-books">No {activeTab} books available yet.</p>
                )}
            </div>

            {/* Cart Message */}
            {cartMessage && <div className="cart-message">{cartMessage}</div>}
        </div>
    );
};

export default Book;