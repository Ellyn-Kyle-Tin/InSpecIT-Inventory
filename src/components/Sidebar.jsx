import { useState } from "react"
import "./sidebar.css"

const Sidebar = ({ activeTab, setActiveTab, userRole, userName, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", iconSrc: "/dashboard.png" },
    { id: "inventory", label: "Inventory", iconSrc: "/inventory.png" },
    { id: "products", label: "Products", iconSrc: "/product.png" },
    { id: "transactions", label: "Transactions", iconSrc: "/transactions.png" },
    { id: "clients", label: "Clients", iconSrc: "/client.png" },
  ]

  const employeeMenuItems = [
    { id: "dashboard", label: "Dashboard", iconSrc: "/dashboard.png" },
    { id: "products", label: "Products", iconSrc: "/product.png" },
  ]

  const menuItems = userRole === "admin" ? adminMenuItems : employeeMenuItems
  const displayRole = userRole === "admin" ? "ADMIN" : "EMPLOYEE"

  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    setIsMobileMenuOpen(false)
    onLogout()
  }

  return (
    <>
      {/* Mobile menu toggle button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Mobile overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside className={`sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <span className="nav-icon">
                  <img
                    src={item.iconSrc}
                    alt={item.label}
                    className="nav-icon-img"
                  />
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-user-role">{displayRole}</div>
            <div className="sidebar-user-name">{userName || "User"}</div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
