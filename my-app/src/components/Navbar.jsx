import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default state for login status
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('loggedInUser'); // Optional: Remove user data if stored
    setIsLoggedIn(false); // Set the state to false
    navigate('/login'); // Navigate to login page
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login state when component mounts and when localStorage changes
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token); // Set the login state based on the token in localStorage
    };

    window.addEventListener('storage', checkLogin); // Listen for changes in localStorage
    checkLogin(); // Check login state when the component is mounted

    return () => window.removeEventListener('storage', checkLogin); // Cleanup
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}>
      <h2 onClick={() => navigate('/')} className="logo">
        CAMPUSKart
      </h2>

      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </>
        ) : (
          <>
            <Link to="/home">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/sell">Sell</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
