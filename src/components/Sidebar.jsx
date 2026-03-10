import "./sidebar.css"

const Sidebar = ({ activeTab, setActiveTab, userRole, userName, onLogout }) => {
  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", iconSrc: "/dashboard.png" },
    { id: "inventory", label: "Inventory", iconSrc: "/inventory.png" },
    { id: "products", label: "Products", iconSrc: "/product.png" },
    { id: "transactions", label: "Transactions", iconSrc: "/transactions.png" },
    { id: "clients", label: "Clients", iconSrc: "/client.png" },
  ]

  const employeeMenuItems = [
  ]

  const menuItems = userRole === "admin" ? adminMenuItems : employeeMenuItems
  const displayRole = userRole === "admin" ? "ADMIN" : "EMPLOYEE"

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
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
        <button className="sidebar-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
