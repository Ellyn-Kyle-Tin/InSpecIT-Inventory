import { useState } from "react";
import "./login.css";

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const switchToRegister = () => setIsRegister(true);
  const switchToLogin = () => setIsRegister(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check for admin credentials
    if (username === "admin" && password === "password123") {
      onLogin("admin", "admin", "Admin");
    } else {
      alert("Invalid username or password");
    }
  };

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
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
            />
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


