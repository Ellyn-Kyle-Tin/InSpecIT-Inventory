import { useState } from "react"
import "./App.css"
import Login from "./components/Login"
import AdminDashboard from "./components/AdminDashboard"
import EmployeeDashboard from "./components/EmployeeDashboard"
import { mockFirestore, serverTimestamp } from "./simpleAuth"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  console.log('App component rendering...');
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState("")
  const [userName, setUserName] = useState("")

  const recordLogoutHistory = async (userName, userType) => {
    try {
      await mockFirestore.collection("userLoginHistory").add({
        userName,
        userType,
        action: "Logout",
        timestamp: serverTimestamp(),
        ipAddress: "Local",
        sessionDuration: "Ended"
      })
    } catch (error) {
      console.error("Error recording logout history: ", error)
    }
  }

  const handleLogin = (user, role, name) => {
    setCurrentUser(user)
    setUserRole(role)
    setUserName(name)
  }

  const handleLogout = async () => {
    if (userName && userRole) {
      await recordLogoutHistory(userName, userRole === "admin" ? "Admin" : "Employee")
    }
    
    setCurrentUser(null)
    setUserRole("")
    setUserName("")
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="App">
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Show AdminDashboard for both admin and employee users */}
      <AdminDashboard onLogout={handleLogout} userName={userName} userRole={userRole} />
    </div>
  )
}

export default App
