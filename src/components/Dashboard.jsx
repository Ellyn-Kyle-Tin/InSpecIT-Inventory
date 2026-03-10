import React from "react"
import "./dashboard.css"
import { FiDollarSign } from "react-icons/fi"
import { FiPackage, FiShoppingCart, FiUsers, FiTrendingUp, FiAlertCircle } from "react-icons/fi"

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
    {
      id: "inventory",
      label: "View Inventory",
      icon: <FiPackage size={24} />,
    },
    {
      id: "products",
      label: "Manage Products",
      icon: <FiShoppingCart size={24} />,
    },
    {
      id: "transactions",
      label: "View Transactions",
      icon: <FiDollarSign size={24} />,
    },
    {
      id: "clients",
      label: "View Clients",
      icon: <FiUsers size={24} />,
    },
  ]

  return (
    <div className="dashboard-container">

      <div className="page-header">
        <FiTrendingUp size={32} className="page-header-icon1" />
        <h1 className="page-header">Dashboard</h1>
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
      <FiPackage size={60} className="summary-icon-img"/>
      <p className="summary-number">1,234</p>
    </div>
    <div className="summary-label">TOTAL STOCK</div>
  </div>

  <div className="summary-card">
    <div className="summary-top">
      <FiShoppingCart size={60} className="summary-icon-img"/>
      <p className="summary-number">567</p>
    </div>
    <div className="summary-label">TOTAL PRODUCTS</div>
  </div>

  <div className="summary-card">
    <div className="summary-top">
      <FiAlertCircle size={45} className="summary-icon-img"/>
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
                {action.icon}
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