import React, { useState, useEffect } from "react";
import "./cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // ✅ Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      // Ensure each item has a unique ID (fallback to index if missing)
      const uniqueCart = parsedCart.map((item, index) => ({
        ...item,
        uniqueKey: item.id || item._id || `${item.title}-${index}-${Date.now()}`,
      }));

      setCartItems(uniqueCart);
      calculateTotal(uniqueCart);
    }
  }, []);

  // ✅ Calculate total price
  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // ✅ Remove or reduce item quantity
  const removeItem = (uniqueKey) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.uniqueKey === uniqueKey) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null; // remove item if quantity = 1
          }
        }
        return item;
      })
      .filter((item) => item !== null);

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  // ✅ Proceed to checkout
  const checkout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <div className="cart-container">
      <h2>🛒 Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.uniqueKey}>
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
              <p>
                Rs.{Number(item.price).toFixed(2)} x {item.quantity}
              </p>
              <button
                className="remove-btn"
                onClick={() => removeItem(item.uniqueKey)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <div id="total-price">Total Price: Rs.{totalPrice.toFixed(2)}</div>
        {cartItems.length > 0 && (
          <button className="checkout-btn" onClick={checkout}>
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;