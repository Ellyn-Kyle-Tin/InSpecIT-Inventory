import { useState } from "react";
import "./login.css";

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // <-- Update API_BASE to point to your PHP API folder
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/InSpecIT-Inventory/api";

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

  // ==================== LOGIN ====================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginNotice("");
    setLoginWarning("");
    setLoginFieldErrors({ username: false, password: false });

    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // <-- JSON header
        body: JSON.stringify({ username, password }),    // <-- send JSON
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        const msg = (data?.message || "Invalid username or password").toString();

        if (res.status === 401 || msg.toLowerCase().includes("incorrect")) {
          const field = data?.errorField === "password" ? "password" : "username";
          setLoginWarning(msg);
          setLoginFieldErrors({
            username: field === "username",
            password: field === "password",
          });
          return;
        }

        alert(msg);
        return;
      }

      // Successful login
      onLogin(data.user.username, data.user.role, data.user.fullName || data.user.username);

    } catch (err) {
      console.error("Login error:", err);
      alert("Could not reach the API. Make sure Apache is running and the URL is correct.");
    }
  };

  // ==================== REGISTER ====================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username) errors.username = true;
    if (!formData.email) errors.email = true;
    if (!formData.password) errors.password = true;
    if (!formData.confirmPassword) errors.confirmPassword = true;
    if (!formData.fullName) errors.fullName = true;
    if (!formData.role) errors.role = true;

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = true;
      errors.password = true;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        const msg = data?.message || "Registration failed";
        alert(msg);
        return;
      }

      alert("Registration successful! Please login with your new account.");
      switchToLogin();
    } catch (err) {
      console.error("Registration error:", err);
      alert("Could not reach the API. Make sure Apache is running and the URL is correct.");
    } finally {
      setLoading(false);
    }
  };

  // ==================== JSX ====================
  return (
    <div className="auth-root">
      <div className="auth-bg" />
      <div className={`side-text ${isRegister ? "move-right" : ""}`}>
        <img src="logo.png" alt="Logo" className="side-logo" />
      </div>

      <div className={`auth-panel ${isRegister ? "slide-left" : ""}`}>
        {/* LOGIN FORM */}
        <div className={`form-box ${isRegister ? "hidden" : "visible"}`}>
          <h1>Log In</h1>

          {loginWarning && <div className="alert">{loginWarning}</div>}
          {loginNotice && <div className="notice">{loginNotice}</div>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Username:</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                className={loginFieldErrors.username ? "error" : ""}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                className={loginFieldErrors.password ? "error" : ""}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">Log In</button>
          </form>

          <p className="switch-line">
            Don't have an account? <button onClick={switchToRegister}>Register now</button>
          </p>
        </div>

        {/* REGISTER FORM */}
        <div className={`form-box ${isRegister ? "visible" : "hidden"}`}>
          <h1>Sign Up</h1>
          {/* ... keep your register form JSX ... */}
          <button 
            className="btn-primary" 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          <p className="switch-line">
            Already have an account? <button onClick={switchToLogin}>Log in</button>
          </p>
        </div>
      </div>
    </div>
  );
}