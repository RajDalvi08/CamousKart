import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, ArrowLeft, ShoppingBag } from "lucide-react";
import "./checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Load cart items
  useEffect(() => {
    if (location.state?.cartItems) setCartItems(location.state.cartItems);
    else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCartItems(JSON.parse(savedCart));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // COD Payment
  const handlePlaceOrder = () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
      return alert("Please fill in all shipping details!");
    }
    setOrderSuccess(true);
    localStorage.removeItem("cart");
    setTimeout(() => navigate("/"), 2000);
  };

  // Razorpay Payment
  const handleRazorpayPayment = async () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
      return alert("Please fill in all shipping details!");
    }

    const totalAmount = total * 100; // in paise

    const response = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount }),
    });
    const data = await response.json();

    const options = {
      key: "YOUR_RAZORPAY_KEY", // Test Key
      amount: data.amount,
      currency: data.currency,
      name: "CampusKart",
      description: "Order Payment",
      order_id: data.id,
      handler: function (response) {
        console.log("Payment Success:", response);
        setOrderSuccess(true);
        localStorage.removeItem("cart");
        setTimeout(() => navigate("/"), 2000);
      },
      prefill: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        contact: shippingInfo.phone,
      },
      theme: { color: "#3399cc" },
    };

    // Enforce UPI if selected
    if (paymentMethod === "upi") options.method = { upi: true };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!cartItems.length) {
    return (
      <div className="checkout-empty">
        <p>Your cart is empty.</p>
        <button onClick={() => navigate("/sell")} className="go-back-btn">
          <ArrowLeft size={18} /> Go to Sell Page
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-header">
        <h1>
          <ShoppingBag size={26} /> Checkout
        </h1>
        <p>Review your items, enter shipping info, and complete your order.</p>
      </div>

      <div className="checkout-body">
        <div className="checkout-left">
          {/* Shipping */}
          <div className="checkout-card">
            <h2>Shipping Information</h2>
            {["name", "email", "phone", "address"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
                {field !== "address" ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={shippingInfo[field]}
                    onChange={handleInputChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ) : (
                  <textarea
                    name={field}
                    value={shippingInfo[field]}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Shipping Address"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="checkout-card">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              {["cod", "upi", "card"].map((method) => (
                <label key={method}>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {method === "cod"
                    ? "Cash on Delivery"
                    : method === "upi"
                    ? "UPI / Wallet"
                    : "Credit / Debit Card"}
                </label>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div className="card-details">
                <CreditCard className="card-icon" />
                <input type="text" placeholder="Card Number" maxLength="16" />
                <div className="card-row">
                  <input type="text" placeholder="MM/YY" maxLength="5" />
                  <input type="text" placeholder="CVV" maxLength="3" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-right">
          <div className="checkout-card">
            <h2>Order Summary</h2>
            {cartItems.map((item, i) => (
              <div className="summary-item" key={i}>
                <div className="summary-image">
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="summary-details">
                  <h3>{item.name}</h3>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="summary-total">
              <h3>Total:</h3>
              <p>₹{total.toFixed(2)}</p>
            </div>
            <button
              className="place-order-btn"
              onClick={
                paymentMethod === "cod"
                  ? handlePlaceOrder
                  : handleRazorpayPayment
              }
            >
              Place Order
            </button>
            {orderSuccess && (
              <p className="success-msg">🎉 Order placed successfully!</p>
            )}
          </div>
        </div>
      </div>

      <div className="checkout-footer">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    </div>
  );
};

export default Checkout;
