import React from "react"
import "./dashboard.css"

const Dashboard = ({ setActiveTab, userName }) => {

  const today = new Date()

  const date = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  const time = today.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })

  const quickActions = [
    { id: "inventory", label: "View Inventory", icon: "/inventory.png" },
    { id: "products", label: "View Products", icon: "/product.png" },
    { id: "transactions", label: "View Transactions", icon: "/transactions.png" },
    { id: "clients", label: "View Clients", icon: "/client.png" }
  ]

  return (
    <div className="dashboard-container">

      <div className="page-header">
        <img src="/dashboard.png" alt="Dashboard" className="page-header-icon" />
        <h1 className="page-header-title">Dashboard</h1>
      </div>

      <div className="dashboard-top">

        {/* LEFT */}
        <div className="welcome-text">
          <h2>WELCOME ! {userName || "ADMIN"}</h2>
        </div>

        {/* RIGHT WINDMILL IMAGE */}
        <div className="windmill-wrapper">
          <img src="/windmill.png" alt="Windmill" className="windmill-image"/>

          <div className="date-time">
            <p>{date}</p>
            <p>{time}</p>
          </div>
        </div>

      </div>

{/* SUMMARY SECTION */}
<div className="summary-section">

  <div className="summary-card">
    <div className="summary-top">
      <img src="/inventory.png" alt="Total Stock" className="summary-icon-img"/>
      <p className="summary-number">1,234</p>
    </div>
    <div className="summary-label">TOTAL STOCK</div>
  </div>

  <div className="summary-card">
    <div className="summary-top">
      <img src="/product.png" alt="Total Products" className="summary-icon-img"/>
      <p className="summary-number">567</p>
    </div>
    <div className="summary-label">TOTAL PRODUCTS</div>
  </div>

  <div className="summary-card">
    <div className="summary-top">
      <img src="/warning.png" alt="Out of Stock" className="summary-icon-img"/>
      <p className="summary-number">12</p>
    </div>
    <div className="summary-label">OUT OF STOCK</div>
  </div>

</div>
      {/* QUICK ACTIONS SECTION */}
      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className="quick-action-btn"
              onClick={() => setActiveTab(action.id)}
            >
              <div className="action-icon">
                <img src={action.icon} alt={action.label} />
              </div>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard