import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md"; // Added MdFavorite

const Home = () => {
  const navigate = useNavigate();

  // 🛒 Initialize Cart
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartMessage, setCartMessage] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const savedFav = localStorage.getItem("favorites");
    return savedFav ? JSON.parse(savedFav) : [];
  });

  // 🛒 Add to Cart
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((cartItem) =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, id: new Date().getTime(), quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartMessage(`${item.name} has been added to your cart!`);
    setTimeout(() => setCartMessage(""), 3000);
    alert(`${item.name} has been added to cart`);
  };

  // ❤️ Toggle Favorite
  const toggleFavorite = (item) => {
    const isFav = favorites.find((fav) => fav.name === item.name);
    let updatedFav;

    if (isFav) {
      updatedFav = favorites.filter((fav) => fav.name !== item.name);
    } else {
      updatedFav = [...favorites, item];
    }

    setFavorites(updatedFav);
    localStorage.setItem("favorites", JSON.stringify(updatedFav));
  };

  // ❌ Remove from Cart
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Campus Store 🎓</h1>
          <p>
            Your one-stop shop for student essentials – books, calculators, lab
            coats & more!
          </p>
          <Link to="/books">
            <button className="btn-primary">Shop Now</button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="grid category-grid">
          {[
            {
              name: "Books",
              img: "https://img.icons8.com/color/96/books.png",
              link: "/books",
            },
            {
              name: "Calculators",
              img: "https://img.icons8.com/color/96/calculator.png",
              link: "/calculators",
            },
            {
              name: "Lab Coats",
              img: "https://i5.walmartimages.com/asr/9f19dc11-83a7-4035-a68c-a73e1791b632_1.22fec432b3f6dd1325b2c83cceea31d3.jpeg",
              link: "/labcoats",
            },
            {
              name: "EG Kit",
              img: "https://img.icons8.com/color/96/engineering.png",
              link: "/EGKIT",
            },
          ].map((cat, idx) => (
            <div className="card category-card" key={idx}>
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
              <Link to={cat.link} className="btn-link">
                Browse
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section">
        <h2 className="section-title">Best Sellers</h2>
        <div className="grid product-grid">
          {[
            {
              name: "Scientific Calculator",
              price: 25,
              img: "https://bestcalculators.net/wp-content/uploads/2018/04/Helect-H1002-1.jpg",
            },
            {
              name: "Engineering Drawing",
              price: 15,
              img: "https://dukaan.b-cdn.net/700x700/webp/media/54ff9df0-f9ae-41a2-a125-30876fa956da.jpg",
            },
            {
              name: "White Lab Coat",
              price: 30,
              img: "https://i5.walmartimages.com/asr/9f19dc11-83a7-4035-a68c-a73e1791b632_1.22fec432b3f6dd1325b2c83cceea31d3.jpeg",
            },
          ].map((item, idx) => {
            const isFav = favorites.find((fav) => fav.name === item.name);
            return (
              <div className="card product-card" key={idx}>
                <div className="product-image-container">
                  <img src={item.img} alt={item.name} />
                  <button
                    className="fav-btn"
                    onClick={() => toggleFavorite(item)}
                    title={
                      isFav ? "Remove from Favorites" : "Add to Favorites"
                    }
                  >
                    {isFav ? (
                      <MdFavorite className="fav-icon filled" />
                    ) : (
                      <MdFavoriteBorder className="fav-icon" />
                    )}
                  </button>
                </div>

                <h3>{item.name}</h3>
                <p className="price">${item.price.toFixed(2)}</p>
                <button
                  className="btn-secondary"
                  onClick={() => addToCart({ ...item })}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <h2 className="section-title">What Students Say</h2>
        <div className="grid testimonial-grid">
          {[
            {
              name: "John Doe",
              image: "https://randomuser.me/api/portraits/men/21.jpg",
              testimonial:
                "The Campus Store made my semester so much easier. I got all my textbooks and lab coats in one place!",
            },
            {
              name: "Jane Smith",
              image: "https://randomuser.me/api/portraits/women/22.jpg",
              testimonial:
                "I found the best calculator for my engineering course at an affordable price. Highly recommend!",
            },
            {
              name: "Mark Lee",
              image: "https://randomuser.me/api/portraits/men/10.jpg",
              testimonial:
                "Fast delivery and great service. The white lab coat I ordered was perfect for my lab work.",
            },
          ].map((student, idx) => (
            <div className="card testimonial-card" key={idx}>
              <img
                src={student.image}
                alt={student.name}
                className="testimonial-image"
              />
              <h3>{student.name}</h3>
              <p className="testimonial-text">"{student.testimonial}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Message */}
      {cartMessage && <div className="cart-message">{cartMessage}</div>}

      {/* Footer */}
      <footer className="footer">
        <p>📚 Campus Store © 2025 | All Rights Reserved</p>
        <p>
          Need help? <Link to="/Contact">Contact Us</Link>
        </p>
      </footer>
    </div>
  );
};

export default Home;
