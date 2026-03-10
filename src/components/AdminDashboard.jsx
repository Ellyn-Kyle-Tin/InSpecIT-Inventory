import { useState } from "react"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import Inventory from "./Inventory"
import TransactionRecords from "./TransactionRecords"
import Products from "./Products"
import "./clients.css"

const AdminDashboard = ({ onLogout, userName, userRole }) => {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} userName={userName} />
      case "inventory":
        return <Inventory userName={userName} />
      case "products":
        return <Products />
      case "transactions":
        return <TransactionRecords />
      case "clients":
        return (
          <div className="clients-container">
            <div className="page-header">
              <img src="/client.png" alt="Clients" className="page-header-icon" />
              <h1 className="page-header-title">CLIENTS</h1>
            </div>
          </div>
        )
      default:
        return <Dashboard setActiveTab={setActiveTab} userName={userName} />
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="header-left">
          <img src="/logo.png" alt="Logo" className="header-logo" />
          <div>
            <h1>Inventory System</h1>
            <p>Inventory Management System</p>
          </div>
        </div>
        <div className="header-right">
          <span className="user-badge">{userRole === "admin" ? "ADMIN" : "EMPLOYEE"}</span>
        </div>
      </header>

      <div className="dashboard-content">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          isAdmin={userRole === "admin"}
          userRole={userRole}
          userName={userName}
        />
        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  )
}

export default AdminDashboard
