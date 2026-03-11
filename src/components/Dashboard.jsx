import React, { useEffect, useMemo, useState } from "react"
import "./dashboard.css"
import {
  FiAlertCircle,
  FiBox,
  FiClock,
  FiFileText,
  FiPackage,
  FiUsers,
} from "react-icons/fi"

const Dashboard = ({ setActiveTab, userRole }) => {

  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const products = useMemo(
    () => [
      { name: "Solar Panel", stock: 5 },
      { name: "Solar Battery", stock: 120 },
      { name: "Solar Inverter", stock: 195 },
    ],
    []
  )

  const totalProducts = products.length
  const totalStocks = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockThreshold = 10
  const lowStockProducts = products.filter((p) => p.stock <= lowStockThreshold)

  const todayKey = now.toISOString().slice(0, 10)
  const clientAppointments = useMemo(
    () => [
      { date: todayKey, client: "Juan Dela Cruz", service: "Solar Installation" },
      { date: todayKey, client: "Maria Santos", service: "CCTV Installation" },
    ],
    [todayKey]
  )
  const todaysAppointments = clientAppointments.filter((a) => a.date === todayKey)

  const salesPerMonth = useMemo(
    () => [
      { month: "Jan", sales: 12000 },
      { month: "Feb", sales: 18000 },
      { month: "Mar", sales: 15000 },
      { month: "Apr", sales: 22000 },
      { month: "May", sales: 19500 },
      { month: "Jun", sales: 26000 },
      { month: "Jul", sales: 21000 },
      { month: "Aug", sales: 28000 },
      { month: "Sep", sales: 24000 },
      { month: "Oct", sales: 30000 },
      { month: "Nov", sales: 27000 },
      { month: "Dec", sales: 32000 },
    ],
    []
  )
  const maxMonthlySales = Math.max(...salesPerMonth.map((d) => d.sales))

  const welcomeMessage = userRole === "admin" ? "Welcome back, Admin!" : "Welcome back, Employee!"

  return (
    <div className="dashboard-container">
      <div className="dash-topbar">
        <div className="dash-page-title">
          <img className="dash-page-icon-img" src="/dashboard.png" alt="Dashboard" />
          <span className="dash-page-text">Dashboard</span>
        </div>

        <div className="dash-header-text">
          <h2 className="dash-welcome">{welcomeMessage}</h2>
          <p className="dash-date">
            {date}
            <span className="dash-date-sep">•</span>
            {time}
          </p>
        </div>
      </div>

      <div className="dash-grid">
        {/* Inventory Summary */}
        <section className="dash-card dash-card--span2 dash-card--inventory">
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">Inventory Summary</h3>
              <p className="dash-card-subtitle">Overview of products and stock levels</p>
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-tile">
              <div className="summary-tile-body">
                <div className="summary-tile-value">{totalProducts}</div>
              </div>
              <div className="summary-tile-footer">Total Products</div>
            </div>

            <div className="summary-tile">
              <div className="summary-tile-body">
                <div className="summary-tile-value">{totalStocks}</div>
              </div>
              <div className="summary-tile-footer">Total Stocks</div>
            </div>

            <div className="summary-tile">
              <div className="summary-tile-body">
                <div className="summary-tile-value">{lowStockProducts.length}</div>
                <div className="summary-tile-sub">
                  {lowStockProducts.length ? "Needs attention" : "All good"}
                </div>
              </div>
              <div className="summary-tile-footer">Low Stock Alert</div>
            </div>
          </div>

          <div className="low-stock-list">
            {lowStockProducts.length ? (
              lowStockProducts.map((p) => (
                <div key={p.name} className="low-stock-item">
                  <span className="low-stock-name">{p.name}</span>
                  <span className="low-stock-pill">Low Stock ({p.stock} remaining)</span>
                </div>
              ))
            ) : (
              <div className="low-stock-empty">No low-stock products right now.</div>
            )}
          </div>
        </section>

        {/* Today's Client Note */}
        <section className="dash-card">
          <div className="dash-card-head">
            <div className="dash-card-titleRow">
              <h3 className="dash-card-title">Today's Client Schedule</h3>
              <span className="dash-chip">
                <FiClock />
                Today
              </span>
            </div>
            <p className="dash-card-subtitle">Appointments scheduled for today</p>
          </div>

          <div className="client-note">
            {todaysAppointments.length ? (
              todaysAppointments.map((appt, idx) => (
                <div key={`${appt.client}-${idx}`} className="client-note-item">
                  <div className="client-note-title">{appt.client}</div>
                  <div className="client-note-sub">Service: {appt.service}</div>
                </div>
              ))
            ) : (
              <div className="client-note-empty">No client appointments scheduled for today.</div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dash-card">
          <div className="dash-card-head">
            <h3 className="dash-card-title">Quick Actions</h3>
            <p className="dash-card-subtitle">Jump to key areas of the system</p>
          </div>

          <div className="quick-actions-grid">
            <button className="qa-btn" onClick={() => setActiveTab("products")} type="button">
              <span className="qa-icon qa-icon--indigo">
                <FiBox />
              </span>
              <span className="qa-text">
                <span className="qa-title">Manage Products</span>
                <span className="qa-sub">Open Products</span>
              </span>
            </button>

            <button className="qa-btn" onClick={() => setActiveTab("inventory")} type="button">
              <span className="qa-icon qa-icon--green">
                <FiPackage />
              </span>
              <span className="qa-text">
                <span className="qa-title">View Inventory</span>
                <span className="qa-sub">Open Inventory</span>
              </span>
            </button>

            <button className="qa-btn" onClick={() => setActiveTab("clients")} type="button">
              <span className="qa-icon qa-icon--blue">
                <FiUsers />
              </span>
              <span className="qa-text">
                <span className="qa-title">View Clients</span>
                <span className="qa-sub">Open Clients</span>
              </span>
            </button>

            <button className="qa-btn" onClick={() => setActiveTab("transactions")} type="button">
              <span className="qa-icon qa-icon--amber">
                <FiFileText />
              </span>
              <span className="qa-text">
                <span className="qa-title">View History</span>
                <span className="qa-sub">Open Transactions</span>
              </span>
            </button>
          </div>
        </section>

        {/* Sales per Month Graph */}
        <section className="dash-card dash-card--span2 dash-card--sales">
          <div className="dash-card-head">
            <h3 className="dash-card-title">Sales per Month</h3>
            <p className="dash-card-subtitle">Sample monthly sales overview</p>
          </div>

          <div className="sales-chart" role="img" aria-label="Bar chart of sales per month">
            {salesPerMonth.map((d) => (
              <div key={d.month} className="sales-bar">
                <div
                  className="sales-bar-fill"
                  style={{ height: `${Math.round((d.sales / maxMonthlySales) * 100)}%` }}
                  title={`${d.month}: ${d.sales.toLocaleString()}`}
                />
                <div className="sales-bar-label">{d.month}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard

