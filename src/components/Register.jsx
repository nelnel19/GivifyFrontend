import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";
// Import your image
import GivifyImage from "../Assets/givify2.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message when user starts typing
    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Additional validation
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (formData.age < 18) {
      setMessage("You must be at least 18 years old to register");
      return;
    }

    setIsLoading(true);

    try {
      await API.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-content">
          <div className="register-header">
            <h1>Create Enterprise Account</h1>
            <p>Join the corporate philanthropy network for strategic social impact</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Executive Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Corporate Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="executive@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
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
                  placeholder="Create secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="form-input"
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

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="form-input"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="120"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            {message && (
              <div className="register-message error" role="alert">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className={`register-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Establish Partnership"}
            </button>
          </form>

          <div className="signup-section">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="signup-link">
                Access Dashboard
              </Link>
            </p>
          </div>

          <div className="footer">
            <p>Building sustainable futures through strategic giving.</p>
          </div>
        </div>
        
        <div className="register-image">
          <img 
            src={GivifyImage} 
            alt="Givify Corporate Platform" 
            className="register-image-content"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;