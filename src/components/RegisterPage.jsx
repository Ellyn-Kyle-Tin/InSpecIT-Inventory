import { useState } from "react"
import { simpleRegister } from "../simpleAuth"
import "./login.css"

const RegisterPage = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: ""
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

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
      onBackToLogin()
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
    <div className="login-container">
      {/* Left Half - Background Image and Logo */}
      <div className="login-left-half">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      {/* Right Half - Register Form */}
      <div className="login-right-half">
        <div className="login-card">
          <div className="logo-section">
            <h1>Create Account</h1>
            <p>Join our Inventory Management System</p>
          </div>

          <div className="register-form">
            <div className="form-group">
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

            <div className="form-group">
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

            <div className="form-group">
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

            <div className="form-group" style={{ position: "relative" }}>
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

            <div className="form-group" style={{ position: "relative" }}>
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

            <div className="form-group">
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
              className="register-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            <div className="register-link">
              <span>Already have an account? </span>
              <a href="#" className="register-text" onClick={onBackToLogin}>
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
