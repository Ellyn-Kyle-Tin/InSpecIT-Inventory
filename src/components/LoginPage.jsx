import { useState } from "react";
import "./login.css";
import Dashboard from "./Dashboard";

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "password123";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const switchToRegister = () => { setIsRegister(true); setError(""); };
  const switchToLogin = () => { setIsRegister(false); setError(""); };

  const handleLogin = () => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setError("");
      setLoggedIn(true);
    } else {
      setError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (loggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

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

          {error && <p className="error-msg">{error}</p>}

          <div className="field">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button className="btn-primary" onClick={handleLogin}>Log In</button>

          <p className="switch-line">
            Don't have an account?{" "}
            <button onClick={switchToRegister}>Register now</button>
          </p>
        </div>

        {/* REGISTER FORM */}
        <div className={`form-box ${isRegister ? "visible" : "hidden"}`}>
          <h1>Sign Up</h1>

          <div className="field">
            <label>Username:</label>
            <input type="text" placeholder="Enter your username" autoComplete="username" />
          </div>

          <div className="field">
            <label>Email:</label>
            <input type="email" placeholder="Enter your email" autoComplete="email" />
          </div>

          <div className="field">
            <label>Password:</label>
            <input type="password" placeholder="Enter your password" autoComplete="new-password" />
          </div>

          <button className="btn-primary">Sign Up</button>

          <p className="switch-line">
            Already have an account?{" "}
            <button onClick={switchToLogin}>Log in</button>
          </p>
        </div>

      </div>
    </div>
  );
}