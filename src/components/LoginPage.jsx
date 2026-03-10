import { useState } from "react"
import { simpleLogin, mockFirestore, serverTimestamp } from "../simpleAuth"
import RegisterPage from "./RegisterPage"
import "./login.css"

const LoginPage = ({ onLogin }) => {
  console.log('LoginPage component rendering...');
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "info" })
  const [fieldErrors, setFieldErrors] = useState({ username: false, password: false })

  if (showRegister) {
    return <RegisterPage onBackToLogin={() => setShowRegister(false)} />
  }

  const showMessage = (title, message, type = "info") => {
    setModalContent({ title, message, type })
    setShowModal(true)
  }

  const clearFieldErrors = () => {
    setFieldErrors({ username: false, password: false })
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    if (fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: false }))
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: false }))
    }
  }

  const recordLoginHistory = async (userName, userType, action = "Login") => {
    try {
      await mockFirestore.collection("userLoginHistory").add({
        userName: userName,
        userType: userType,
        action: action,
        timestamp: serverTimestamp(),
        ipAddress: "Local",
        sessionDuration: "Active"
      });
    } catch (error) {
      console.error("Error recording login history:", error);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showMessage("Missing Information", "Please enter username and password", "error")
      return
    }

    setLoading(true)
    clearFieldErrors()

    try {
      const result = await simpleLogin(username, password)
      const user = result.user
      const userData = result.userData

      const role = userData.role?.toLowerCase()
      const name = userData.name

      if (role !== "admin" && role !== "employee") {
        showMessage("Access Denied", "You don't have permission to access this system.", "error")
        setLoading(false)
        return
      }

      await recordLoginHistory(name, role === "admin" ? "Admin" : "Employee")
      onLogin(user, role, name)
    } catch (error) {
      console.error("Login error:", error)
      
      if (error.message === "Invalid username or password") {
        setFieldErrors(prev => ({ ...prev, username: true, password: true }))
        showMessage("Login Failed", "Incorrect username or password. Please try again.", "error")
      } else {
        showMessage("Login Error", "Login Failed. Please try again.", "error")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-left-half">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      <div className="login-right-half">
        <div className="login-card">
          <div className="logo-section">
            <h1>Inventory System</h1>
            <p>Inventory Management System</p>
          </div>

          <div className="login-form">

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
                className={fieldErrors.username ? 'error' : ''}
              />
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
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

            <button
              className="login-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Processing..." : "Login"}
            </button>

            <div className="register-link">
              <span>Don't have an account? </span>
              <a href="#" className="register-text" onClick={(e) => {
                e.preventDefault()
                setShowRegister(true)
              }}>
                Register
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <div className={`login-modal-header ${modalContent.type}`}>
              <h3>{modalContent.title}</h3>
            </div>
            <div className="login-modal-body">
              <p>{modalContent.message}</p>
            </div>
            <div className="login-modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className={`login-modal-btn ${modalContent.type}`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
