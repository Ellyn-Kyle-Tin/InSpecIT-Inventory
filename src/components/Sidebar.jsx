import { FiGrid, FiBox, FiPackage, FiRepeat, FiUsers } from "react-icons/fi"

const Sidebar = ({ activeTab, setActiveTab, userRole, userName, onLogout }) => {
  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiGrid },
    { id: "inventory", label: "Inventory", icon: FiBox },
    { id: "products", label: "Products", icon: FiPackage },
    { id: "transactions", label: "Transactions", icon: FiRepeat },
    { id: "clients", label: "Clients", icon: FiUsers },
  ]

  const employeeMenuItems = [
    // No items for employee - inventory system only
  ]

  const menuItems = userRole === "admin" ? adminMenuItems : employeeMenuItems
  const displayRole = userRole === "admin" ? "ADMIN" : "EMPLOYEE"

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">
                <Icon />
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
        <button className="sidebar-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
