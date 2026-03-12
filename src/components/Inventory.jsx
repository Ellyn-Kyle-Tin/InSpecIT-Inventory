import React, { useEffect, useMemo, useRef, useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import "./inventory.css"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/InSpecIT-Inventory/api"

const CATEGORIES = ["All", "Electronics", "Cables", "Solar Equipment", "Marine Equipment"]

function getStatus(stocks, minStock) {
  if (stocks <= 0) return { label: "Out of Stock", type: "out" }
  if (minStock > 0 && stocks <= minStock) return { label: "Low Stock", type: "low" }
  return { label: "In Stock", type: "in" }
}

const Inventory = ({ userName }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [restockItem, setRestockItem] = useState(null)
  const [restockQty, setRestockQty] = useState("")
  const [restockLoading, setRestockLoading] = useState(false)
  const categoryRef = useRef(null)

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/inventory.php`)
      const data = await res.json().catch(() => ({}))
      if (data?.success && Array.isArray(data.items)) {
        setItems(data.items)
      }
    } catch (err) {
      console.error("Failed to fetch inventory:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setShowCategoryDropdown(false)
      }
    }
    if (showCategoryDropdown) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showCategoryDropdown])

  const stats = useMemo(() => {
    let inStock = 0
    let outStock = 0
    let lowStock = 0
    items.forEach(({ stocks, minStock }) => {
      const { type } = getStatus(stocks, minStock)
      if (type === "in") inStock++
      else if (type === "out") outStock++
      else lowStock++
    })
    const totalValue = items.reduce((sum, i) => sum + i.stocks * i.unitPrice, 0)
    return { inStock, outStock, lowStock, totalProducts: items.length, totalValue }
  }, [items])

  const filteredItems = useMemo(() => {
    let list = items
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (i) =>
          i.inventoryId.toLowerCase().includes(q) ||
          i.productId.toLowerCase().includes(q) ||
          (i.productName && i.productName.toLowerCase().includes(q))
      )
    }
    if (category !== "All") {
      list = list.filter((i) => i.category === category)
    }
    return list
  }, [items, search, category])

  const handleRestock = (item) => {
    setRestockItem(item)
    setRestockQty("")
  }

  const handleRestockSubmit = async (e) => {
    e.preventDefault()
    const qty = parseInt(restockQty, 10)
    if (isNaN(qty) || qty < 1 || !restockItem) return
    setRestockLoading(true)
    try {
      const body = new URLSearchParams({
        id: String(restockItem.id),
        quantity: String(qty),
      })
      const res = await fetch(`${API_BASE}/inventory.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: body.toString(),
      })
      const data = await res.json().catch(() => ({}))
      if (data?.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === restockItem.id && data.item
              ? { ...i, stocks: data.item.stocks }
              : i
          )
        )
        setRestockItem(null)
        setRestockQty("")
      } else {
        alert(data?.message || "Restock failed")
      }
    } catch (err) {
      console.error(err)
      alert("Restock failed. Please check your API setup.")
    } finally {
      setRestockLoading(false)
    }
  }

  const barTotal = stats.inStock + stats.outStock + stats.lowStock
  const barIn = barTotal ? (stats.inStock / barTotal) * 100 : 0
  const barOut = barTotal ? (stats.outStock / barTotal) * 100 : 0
  const barLow = barTotal ? (stats.lowStock / barTotal) * 100 : 0

  return (
    <div className="inventory">
      <div className="inventory-header">
        <div className="db-title1">
          <img src="/inventory.png" alt="Inventory" className="db-title-icon1" />
          <h1 className="db-title-text1">Inventory</h1>
        </div>
      </div>

      {/* Summary cards */}
      <div className="inventory-summary">
        <div className="inv-card inv-card-assets">
          <div className="inv-card-label">Total Assets Value</div>
          <div className="inv-card-value">
            Php {stats.totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="inv-card inv-card-products">
          <div className="inv-card-label">{stats.totalProducts} Product</div>
          <div className="inv-bar">
            <div
              className="inv-bar-seg inv-bar-in"
              style={{ width: `${barIn}%` }}
              title={`In stock: ${stats.inStock}`}
            />
            <div
              className="inv-bar-seg inv-bar-out"
              style={{ width: `${barOut}%` }}
              title={`Out of stock: ${stats.outStock}`}
            />
            <div
              className="inv-bar-seg inv-bar-low"
              style={{ width: `${barLow}%` }}
              title={`Low stock: ${stats.lowStock}`}
            />
          </div>
          <div className="inv-bar-labels">
            <span>In stock: {stats.inStock}</span>
            <span>Out of stock: {stats.outStock}</span>
            <span>Low stock: {stats.lowStock}</span>
          </div>
        </div>
      </div>

      {/* Search and filter */}
      <div className="inventory-controls">
        <div className="inv-search-wrap">
          <input
            type="text"
            className="inv-search"
            placeholder="Search by inventory ID or product ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src="/search.png" alt="Search" className="inv-search-icon" />
        </div>
        <div className="inv-category-wrap" ref={categoryRef}>
          <button
            type="button"
            className="inv-category-btn"
            onClick={() => setShowCategoryDropdown((v) => !v)}
          >
            Category
            <FiChevronDown className="inv-chevron" />
          </button>
          {showCategoryDropdown && (
            <div className="inv-category-dropdown">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`inv-category-opt ${category === c ? "active" : ""}`}
                  onClick={() => {
                    setCategory(c)
                    setShowCategoryDropdown(false)
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="inv-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              <th>INVENTORY ID</th>
              <th>PRODUCT ID</th>
              <th>PRODUCT NAME</th>
              <th>STOCKS</th>
              <th>Min Stock</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="inv-loading-cell">
                  Loading inventory...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="inv-empty-cell">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const status = getStatus(item.stocks, item.minStock)
                return (
                  <tr key={item.inventoryId}>
                    <td>{item.inventoryId}</td>
                    <td>{item.productId}</td>
                    <td>{item.productName || "—"}</td>
                    <td>{item.stocks}</td>
                    <td>{item.minStock}</td>
                    <td>
                      <span className={`inv-status inv-status-${status.type}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="inv-restock-btn"
                        onClick={() => handleRestock(item)}
                        disabled={restockLoading}
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Restock modal */}
      {restockItem && (
        <div className="inv-modal-overlay" onClick={() => !restockLoading && setRestockItem(null)}>
          <div
            className="inv-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="inv-modal-title">Restock Product</h3>
            <p className="inv-modal-desc">
              {restockItem.inventoryId} — {restockItem.productId}
              {restockItem.productName && ` (${restockItem.productName})`}
            </p>
            <p className="inv-modal-current">
              Current stock: <strong>{restockItem.stocks}</strong>
            </p>
            <form onSubmit={handleRestockSubmit}>
              <label className="inv-modal-label">
                Quantity to add:
              </label>
              <input
                type="number"
                min="1"
                className="inv-modal-input"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                placeholder="Enter quantity"
                required
                disabled={restockLoading}
              />
              <div className="inv-modal-actions">
                <button
                  type="button"
                  className="inv-modal-cancel"
                  onClick={() => !restockLoading && setRestockItem(null)}
                  disabled={restockLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="inv-modal-confirm" disabled={restockLoading}>
                  {restockLoading ? "Updating..." : "Update Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory
