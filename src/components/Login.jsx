import { useState } from "react";
import "./login.css";
import { simpleRegister } from "../simpleAuth";

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Register form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const switchToRegister = () => setIsRegister(true);
  const switchToLogin = () => setIsRegister(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check for admin credentials
    if (username === "admin" && password === "123") {
      onLogin("admin", "admin", "Admin");
    } else {
      alert("Invalid username or password");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.username) errors.username = true
    if (!formData.email) errors.email = true
    if (!formData.password) errors.password = true
    if (!formData.confirmPassword) errors.confirmPassword = true
    if (!formData.fullName) errors.fullName = true
    if (!formData.role) errors.role = true
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = true
      errors.password = true
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await simpleRegister(
        formData.username,
        formData.password,
        formData.fullName,
        formData.email,
        formData.role
      )
      
      alert("Registration successful! Please login with your new account.")
      switchToLogin()
    } catch (error) {
      console.error("Registration error:", error)
      if (error.message === "Username already exists") {
        setFieldErrors(prev => ({ ...prev, username: true }))
        alert("Username already exists. Please choose a different username.")
      } else if (error.message.includes("Invalid role")) {
        setFieldErrors(prev => ({ ...prev, role: true }))
        alert("Please select a valid role (Employee or Admin).")
      } else {
        alert("Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      {/* Background */}
      <div className="auth-bg" />

      {/* Side Logo */}
      <div className={`side-text ${isRegister ? "move-right" : ""}`}>
        <img src="logo.png" alt="Logo" className="side-logo" />
      </div>

      {/* Sliding White Panel */}
      <div className={`auth-panel ${isRegister ? "slide-left" : ""}`}>

        {/* LOGIN FORM */}
        <div className={`form-box ${isRegister ? "hidden" : "visible"}`}>
          <h1>Log In</h1>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Username:</label>
              <input
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">Log In</button>
          </form>

          <p className="switch-line">
            Don't have an account?{" "}
            <button onClick={switchToRegister}>Register now</button>
          </p>
        </div>

        {/* REGISTER FORM */}
        <div className={`form-box ${isRegister ? "visible" : "hidden"}`}>
          <h1>
            Sign Up
          </h1>

          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={fieldErrors.fullName ? 'error' : ''}
            />
          </div>

          <div className="field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              className={fieldErrors.username ? 'error' : ''}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={fieldErrors.email ? 'error' : ''}
            />
          </div>

          <div className="field" style={{ position: "relative" }}>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              style={{ paddingRight: "60px" }}
              className={fieldErrors.password ? 'error' : ''}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-btn"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="field" style={{ position: "relative" }}>
            <label>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              style={{ paddingRight: "60px" }}
              className={fieldErrors.confirmPassword ? 'error' : ''}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-password-btn"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="field">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={fieldErrors.role ? 'error' : ''}
            >
              <option value="">Select your role</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            className="btn-primary" 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="switch-line">
            Already have an account?{" "}
            <button onClick={switchToLogin}>Log in</button>
          </p>
        </div>

      </div>
    </div>
  );
}


