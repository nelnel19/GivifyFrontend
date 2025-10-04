import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import GivifyImage from "../Assets/givify1.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login successful
        alert("Login successful!");

        // Save token and user data to localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("lastLoggedInUser", JSON.stringify(data.user));

        // Redirect to campaigns page
        navigate("/homepage");
      } else {
        // ❌ Backend returned an error
        alert(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left side (form) */}
        <div className="login-content">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Access your corporate philanthropy dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="executive@company.com"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>

          <div className="signup-section">
            <p>
              New to Givify?{" "}
              <Link to="/register" className="signup-link">
                Create Enterprise Account
              </Link>
            </p>
          </div>

          <div className="footer">
            <p>Strategic philanthropy. Measurable impact.</p>
          </div>
        </div>

        {/* Right side (image) */}
        <div className="login-image">
          <img
            src={GivifyImage}
            alt="Givify Corporate Platform"
            className="login-image-content"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;