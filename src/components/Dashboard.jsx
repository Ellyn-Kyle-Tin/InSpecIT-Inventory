import React, { useEffect, useMemo, useState } from "react"
import "./dashboard.css"
import { FiClock } from "react-icons/fi"

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
    <div className="db-wrap">
      <div className="db-top">
        <div className="db-title">
          <img className="db-title-icon" src="/dashboard.png" alt="Dashboard" />
          <span className="db-title-text">Dashboard</span>
        </div>

        <div className="db-header">
          <h2 className="db-welcome">{welcomeMessage}</h2>
          <p className="db-date">
            {date}
            <span className="db-date-sep">•</span>
            {time}
          </p>
        </div>
      </div>

      <div className="db-grid">
        {/* Inventory Summary */}
        <section className="db-card db-card-wide db-card-inv">
          <div className="db-card-head">
            <div>
              <h3 className="db-card-title">Inventory Summary</h3>
              <p className="db-card-sub">Overview of products and stock levels</p>
            </div>
          </div>

          <div className="sum-grid">
            <div className="sum-card">
              <div className="sum-body">
                <div className="sum-value">{totalProducts}</div>
              </div>
              <div className="sum-foot">Total Products</div>
            </div>

            <div className="sum-card">
              <div className="sum-body">
                <div className="sum-value">{totalStocks}</div>
              </div>
              <div className="sum-foot">Total Stocks</div>
            </div>

            <div className="sum-card">
              <div className="sum-body">
                <div className="sum-value">{lowStockProducts.length}</div>
                <div className="sum-sub">
                  {lowStockProducts.length ? "Needs attention" : "All good"}
                </div>
              </div>
              <div className="sum-foot">Low Stock Alert</div>
            </div>
          </div>

          <div className="low-list">
            {lowStockProducts.length ? (
              lowStockProducts.map((p) => (
                <div key={p.name} className="low-item">
                  <span className="low-name">{p.name}</span>
                  <span className="low-pill">Low Stock ({p.stock} remaining)</span>
                </div>
              ))
            ) : (
              <div className="low-empty">No low-stock products right now.</div>
            )}
          </div>
        </section>

        {/* Today's Client Note */}
        <section className="db-card">
          <div className="db-card-head">
            <div className="db-card-row">
              <h3 className="db-card-title">Today's Client Schedule</h3>
              <span className="db-chip">
                <FiClock />
                Today
              </span>
            </div>
            <p className="db-card-sub">Appointments scheduled for today</p>
          </div>

          <div className="note">
            {todaysAppointments.length ? (
              todaysAppointments.map((appt, idx) => (
                <div key={`${appt.client}-${idx}`} className="note-item">
                  <div className="note-title">{appt.client}</div>
                  <div className="note-sub">Service: {appt.service}</div>
                </div>
              ))
            ) : (
              <div className="note-empty">No client appointments scheduled for today.</div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="db-card">
          <div className="db-card-head">
            <h3 className="db-card-title">Quick Actions</h3>
            <p className="db-card-sub">Jump to key areas of the system</p>
          </div>

          <div className="qa-grid">
            <button className="qa-btn" onClick={() => setActiveTab("products")} type="button">
              <span className="qa-icon qa-icon--indigo">
                <img
                  src="/product.png"
                  alt="Products"
                  className="qa-icon-img"
                />
              </span>
              <span className="qa-text">
                <span className="qa-title">Manage Products</span>
                <span className="qa-sub">Open Products</span>
              </span>
            </button>

            <button className="qa-btn" onClick={() => setActiveTab("inventory")} type="button">
              <span className="qa-icon qa-icon--green">
                <img
                  src="/inventory.png"
                  alt="Inventory"
                  className="qa-icon-img"
                />
              </span>
              <span className="qa-text">
                <span className="qa-title">View Inventory</span>
                <span className="qa-sub">Open Inventory</span>
              </span>
            </button>

            <button className="qa-btn" onClick={() => setActiveTab("clients")} type="button">
              <span className="qa-icon qa-icon--blue">
                <img
                  src="/client.png"
                  alt="Clients"
                  className="qa-icon-img"
                />
              </span>
              <span className="qa-text">
                <span className="qa-title">View Clients</span>
                <span className="qa-sub">Open Clients</span>
              </span>
            </button>

            <button className="qa-btn" onClick={() => setActiveTab("transactions")} type="button">
              <span className="qa-icon qa-icon--amber">
                <img
                  src="/transactions.png"
                  alt="Transactions"
                  className="qa-icon-img"
                />
              </span>
              <span className="qa-text">
                <span className="qa-title">View History</span>
                <span className="qa-sub">Open Transactions</span>
              </span>
            </button>
          </div>
        </section>

        {/* Sales per Month Graph */}
        <section className="db-card db-card-wide db-card-sales">
          <div className="db-card-head">
            <h3 className="db-card-title">Sales per Month</h3>
            <p className="db-card-sub">Sample monthly sales overview</p>
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

