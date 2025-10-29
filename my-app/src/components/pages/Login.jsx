import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();

  const storedData = JSON.parse(localStorage.getItem("userData"));

  if (!storedData) {
    alert("No registered user found. Please register first.");
    return;
  }

  if (!college) {
    alert("Please select your college");
    return;
  }

  if (college !== storedData.college) {
    alert("Selected college does not match your registered college");
    return;
  }

  if (
    (email.endsWith("@vcet.edu.in") ||
      email.endsWith("@tsec.edu.in") ||
      email.endsWith("@vjti.edu.in") ||
      email.endsWith("@spit.edu.in")) &&
    email === storedData.email &&
    password === storedData.password
  ) {
    console.log("Login successful", { college: storedData.college, email });

    // Store the token and user data
    localStorage.setItem("token", "sample-auth-token");  // Sample token, you may want to use a real one
    localStorage.setItem("loggedInUser", JSON.stringify(storedData));

    // Redirect to home page
    navigate("/home"); // Navigate to the home page after login
  } else {
    alert("Invalid email or password");
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">CampusKart Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Select College</label>
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            >
              <option value="">-- Select College --</option>
              <option value="VCET">VCET</option>
              <option value="TSEC">TSEC</option>
              <option value="VJTI">VJTI</option>
              <option value="SPIT">SPIT</option>
            </select>
          </div>

          <div className="input-group">
            <label>College Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <AiFillEye
                className="eye-icon"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <AiFillEyeInvisible
                className="eye-icon"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-link">
          Don’t have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#c77dff", fontWeight: "600" }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
