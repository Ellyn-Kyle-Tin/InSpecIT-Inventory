import React, { useEffect, useMemo, useState } from "react"
import "./dashboard.css"
import { FiClock } from "react-icons/fi"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/InSpecIT-Inventory/api"

const Dashboard = ({ setActiveTab, userRole }) => {
  const [now, setNow] = useState(() => new Date())
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/dashboard.php`)
      const data = await response.json()
      
      if (data.success) {
        setDashboardData(data.data)
      } else {
        setError(data.message || 'Failed to load dashboard data')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

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

  // Use real data or fallback to empty state
  const inventory = dashboardData?.inventory || {}
  const clients = dashboardData?.clients || {}
  const projects = dashboardData?.projects || {}

  const welcomeMessage = userRole === "admin" ? "Welcome back, Admin!" : "Welcome back, Employee!"

  if (loading) {
    return (
      <div className="db-wrap">
        <div className="db-top">
          <div className="db-title">
            <img className="db-title-icon" src="/dashboard.png" alt="Dashboard" />
            <span className="db-title-text">Dashboard</span>
          </div>
          <div className="db-header">
            <h2 className="db-welcome">Loading dashboard...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="db-wrap">
        <div className="db-top">
          <div className="db-title">
            <img className="db-title-icon" src="/dashboard.png" alt="Dashboard" />
            <span className="db-title-text">Dashboard</span>
          </div>
          <div className="db-header">
            <h2 className="db-welcome">Error loading dashboard</h2>
            <p className="db-date">{error}</p>
          </div>
        </div>
      </div>
    )
  }

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
                <div className="sum-value">{inventory.total_products || 0}</div>
              </div>
              <div className="sum-foot">Total Products</div>
            </div>

            <div className="sum-card">
              <div className="sum-body">
                <div className="sum-value">{inventory.total_stocks || 0}</div>
              </div>
              <div className="sum-foot">Total Stocks</div>
            </div>

            <div className="sum-card">
              <div className="sum-body">
                <div className="sum-value">{inventory.low_stock_count || 0}</div>
                <div className="sum-sub">
                  {(inventory.low_stock_count || 0) > 0 ? "Needs attention" : "All good"}
                </div>
              </div>
              <div className="sum-foot">Low Stock Alert</div>
            </div>
          </div>

          <div className="low-list">
            {inventory.low_stock_items && inventory.low_stock_items.length > 0 ? (
              inventory.low_stock_items.map((item) => (
                <div key={item.product_name} className="low-item">
                  <span className="low-name">{item.product_name}</span>
                  <span className="low-pill">Low Stock ({item.stocks} remaining)</span>
                </div>
              ))
            ) : (
              <div className="low-empty">No low-stock products right now.</div>
            )}
          </div>
        </section>

        {/* Recent Clients */}
        <section className="db-card">
          <div className="db-card-head">
            <div className="db-card-row">
              <h3 className="db-card-title">Recent Clients</h3>
              <span className="db-chip">
                <FiClock />
                Latest
              </span>
            </div>
            <p className="db-card-sub">Recently added clients</p>
          </div>

          <div className="note">
            {clients.recent_clients && clients.recent_clients.length > 0 ? (
              clients.recent_clients.map((client, idx) => (
                <div key={`${client.client_name}-${idx}`} className="note-item">
                  <div className="note-title">{client.client_name}</div>
                  <div className="note-sub">Status: {client.status}</div>
                </div>
              ))
            ) : (
              <div className="note-empty">No clients found.</div>
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

        {/* Summary Statistics */}
        <section className="db-card">
          <div className="db-card-head">
            <h3 className="db-card-title">Summary Statistics</h3>
            <p className="db-card-sub">Overall system overview</p>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{clients.total_clients || 0}</div>
              <div className="stat-label">Total Clients</div>
              <div className="stat-sub">{clients.active_clients || 0} active</div>
            </div>

            <div className="stat-item">
              <div className="stat-value">{projects.total_projects || 0}</div>
              <div className="stat-label">Total Projects</div>
              <div className="stat-sub">{projects.active_projects || 0} active</div>
            </div>

            <div className="stat-item">
              <div className="stat-value">{projects.completed_projects || 0}</div>
              <div className="stat-label">Completed</div>
              <div className="stat-sub">Projects done</div>
            </div>

            <div className="stat-item">
              <div className="stat-value">{projects.pending_projects || 0}</div>
              <div className="stat-label">Pending</div>
              <div className="stat-sub">Projects pending</div>
            </div>
          </div>
        </section>

        {/* Recent Projects */}
        <section className="db-card db-card-wide">
          <div className="db-card-head">
            <div className="db-card-row">
              <h3 className="db-card-title">Recent Projects</h3>
              <span className="db-chip">
                <FiClock />
                Latest
              </span>
            </div>
            <p className="db-card-sub">Recently added projects</p>
          </div>

          <div className="projects-list">
            {projects.recent_projects && projects.recent_projects.length > 0 ? (
              <div className="projects-grid">
                {projects.recent_projects.map((project, idx) => (
                  <div key={`${project.project_name}-${idx}`} className="project-item">
                    <div className="project-name">{project.project_name}</div>
                    <div className="project-client">Client: {project.client_name}</div>
                    <div className="project-status">
                      <span className={`status-badge ${project.status === "Active" ? "status-active" : "status-inactive"}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="note-empty">No projects found.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard

