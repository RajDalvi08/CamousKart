import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";  // Correct import

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");  // Add state for password
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Ensure all fields are filled out
    if (name && email && password && college) {
      const userData = { email, password, college };
      localStorage.setItem("userData", JSON.stringify(userData));
      alert("Registration successful!");
      console.log("Registered:", { name, email, password, college });
      navigate("/login"); // ✅ Redirect to login
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* College */}
          <div className="input-group">
            <label>College</label>
            <input
              type="text"
              placeholder="Enter your college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Toggle Eye Icon */}
            {showPassword ? (
              <AiFillEye
                className="eye-icon1"
                onClick={() => setShowPassword(false)}
                aria-label="Hide password"
              />
            ) : (
              <AiFillEyeInvisible
                className="eye-icon1"
                onClick={() => setShowPassword(true)}
                aria-label="Show password"
              />
            )}
          </div>

          <button type="submit" className="register-btn">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#c77dff" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
