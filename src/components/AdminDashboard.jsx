import { useState } from "react"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import Inventory from "./Inventory"
import Transaction from "./Transaction"
import Products from "./Products"
import Clients from "./Clients"
import Projects from "./Projects"


const AdminDashboard = ({ onLogout, userName, userRole }) => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedClient, setSelectedClient] = useState(null)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} userName={userName} userRole={userRole} />
      case "inventory":
        return <Inventory userName={userName} />
      case "products":
        return <Products />
      case "transactions":
        return <Transaction />
      case "clients":
        if (selectedClient) {
          return <Projects client={selectedClient} onBack={() => setSelectedClient(null)} />
        }
        return <Clients onSelectClient={(client) => setSelectedClient(client)} />
      default:
        return <Dashboard setActiveTab={setActiveTab} userName={userName} userRole={userRole} />
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="header-left">
          <img src="/InSpecIT_logo.png" alt="Logo" className="header-logo" />
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