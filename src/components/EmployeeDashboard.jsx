import { useState } from "react"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"


const EmployeeDashboard = ({ onLogout, userName }) => {
  const [activeTab, setActiveTab] = useState("dashboard")

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
        <main className="main-content">
          {/* For now employees only see the dashboard overview in read-only mode */}
          <Dashboard setActiveTab={setActiveTab} userRole="employee" userName={userName} />
        </main>
      </div>
    </div>
  )
}

export default EmployeeDashboard
