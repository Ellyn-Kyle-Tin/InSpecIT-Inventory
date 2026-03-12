import { useState } from "react"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import Products from "./Products"


const EmployeeDashboard = ({ onLogout, userName }) => {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} userRole="employee" userName={userName} />
      case "products":
        return <Products />
      default:
        return <Dashboard setActiveTab={setActiveTab} userRole="employee" userName={userName} />
    }
  }

  return (
    <div className="employee-dashboard">
      <header className="header">
        <div className="header-left">
          <img src="/logo.png" alt="Logo" className="header-logo" />
          <div>
            <h1>Inventory System</h1>
            <p>Inventory Management System</p>
          </div>
        </div>
        <div className="header-right">
          <span className="user-badge employee">EMPLOYEE</span>
        </div>
      </header>

      <div className="dashboard-content">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole="employee" 
          userName={userName}
          onLogout={onLogout}
        />
        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  )
}

export default EmployeeDashboard
