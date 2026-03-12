import { useState } from "react";
import "./login.css";

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/inventory/api";

  const [loginNotice, setLoginNotice] = useState("");
  const [loginWarning, setLoginWarning] = useState("");
  const [loginFieldErrors, setLoginFieldErrors] = useState({
    username: false,
    password: false,
  });
  
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

  const switchToRegister = () => {
    setLoginNotice("");
    setLoginWarning("");
    setLoginFieldErrors({ username: false, password: false });
    setIsRegister(true);
  };
  const switchToLogin = () => {
    setLoginNotice("");
    setLoginWarning("");
    setLoginFieldErrors({ username: false, password: false });
    setIsRegister(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginNotice("");
    setLoginWarning("");
    setLoginFieldErrors({ username: false, password: false });

    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({ username, password }).toString(),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) {
        const msg = (data?.message || "").toString()
        const isInvalidCreds = res.status === 401 || msg.toLowerCase().includes("invalid")

        if (res.status === 401) {
          const field = data?.errorField === "password" ? "password" : "username"
          setLoginWarning(msg || (field === "password" ? "Incorrect password." : "Incorrect username."))
          setLoginFieldErrors({
            username: field === "username",
            password: field === "password",
          })
          return
        }

        alert(msg || "Invalid username or password")
        return
      }

      onLogin(data.user.username, data.user.role, data.user.fullName || data.user.username)
    } catch (err) {
      console.error(err)
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
      const res = await fetch(`${API_BASE}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
        }).toString(),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) {
        const msg = data?.message || "Registration failed"
        if (msg.toLowerCase().includes("username") || msg.toLowerCase().includes("email")) {
          setFieldErrors(prev => ({ ...prev, username: true, email: true }))
        }
        if (msg.toLowerCase().includes("role")) {
          setFieldErrors(prev => ({ ...prev, role: true }))
        }
        alert(msg)
        return
      }
      
      alert("Registration successful! Please login with your new account.")
      switchToLogin()
    } catch (error) {
      console.error("Registration error:", error)
      const details =
        error?.message ||
        "Could not reach the API. Check the API base URL/port and that Apache is running."
      alert(`Registration failed.\n\nAPI: ${API_BASE}\nError: ${details}`)
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

          {loginWarning ? (
            <div
              role="alert"
              style={{
                marginBottom: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                fontSize: 14,
                lineHeight: 1.35,
              }}
            >
              {loginWarning}
            </div>
          ) : null}

          {loginNotice ? (
            <div
              role="status"
              style={{
                marginBottom: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#9a3412",
                fontSize: 14,
                lineHeight: 1.35,
              }}
            >
              <div style={{ marginBottom: 8 }}>{loginNotice}</div>
              <button type="button" className="btn-primary" onClick={switchToRegister}>
                Create account
              </button>
            </div>
          ) : null}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Username:</label>
              <input
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                className={loginFieldErrors.username ? "error" : ""}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (loginNotice) setLoginNotice("")
                  if (loginWarning) setLoginWarning("")
                  if (loginFieldErrors.username) {
                    setLoginFieldErrors((prev) => ({ ...prev, username: false }))
                  }
                }}
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
                className={loginFieldErrors.password ? "error" : ""}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (loginNotice) setLoginNotice("")
                  if (loginWarning) setLoginWarning("")
                  if (loginFieldErrors.password) {
                    setLoginFieldErrors((prev) => ({ ...prev, password: false }))
                  }
                }}
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


