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

const Inventory = () => {
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
    <div className="inventory_root">
      <div className="inventory_head">
        <div className="inventory_title">
          <img src="/inventory.png" alt="Inventory" className="inventory_icon" />
          <h1 className="inventory_text">Inventory</h1>
        </div>
      </div>

      {/* Summary cards */}
      <div className="inventory_summary">
        <div className="inv_card card_assets">
          <div className="card_label">Total Assets Value</div>
          <div className="card_value">
            Php {stats.totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="inv_card card_products">
          <div className="card_label">{stats.totalProducts} Product</div>
          <div className="inv_bar">
            <div
              className="bar_seg bar_in"
              style={{ width: `${barIn}%` }}
              title={`In stock: ${stats.inStock}`}
            />
            <div
              className="bar_seg bar_out"
              style={{ width: `${barOut}%` }}
              title={`Out of stock: ${stats.outStock}`}
            />
            <div
              className="bar_seg bar_low"
              style={{ width: `${barLow}%` }}
              title={`Low stock: ${stats.lowStock}`}
            />
          </div>
          <div className="bar_labels">
            <span>In stock: {stats.inStock}</span>
            <span>Out of stock: {stats.outStock}</span>
            <span>Low stock: {stats.lowStock}</span>
          </div>
        </div>
      </div>

      {/* Search and filter */}
      <div className="inventory_controls">
        <div className="search_wrap">
          <input
            type="text"
            className="search_input"
            placeholder="Search by inventory ID or product ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src="/search.png" alt="Search" className="search_icon" />
        </div>
        <div className="filter_wrap" ref={categoryRef}>
          <button
            type="button"
            className="filter_btn"
            onClick={() => setShowCategoryDropdown((v) => !v)}
          >
            Category
            <FiChevronDown className="filter_icon" />
          </button>
          {showCategoryDropdown && (
            <div className="filter_menu">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`filter_item ${category === c ? "active" : ""}`}
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
      <div className="table_wrap">
        <table className="table_main">
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
                <td colSpan={7} className="table_loading">
                  Loading inventory...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="table_empty">
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
                      <span className={`status_pill status_${status.type}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="action_btn"
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
        <div className="modal_overlay" onClick={() => !restockLoading && setRestockItem(null)}>
          <div className="modal_card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal_title">Restock Product</h3>
            <p className="modal_desc">
              {restockItem.inventoryId} — {restockItem.productId}
              {restockItem.productName && ` (${restockItem.productName})`}
            </p>
            <p className="modal_info">
              Current stock: <strong>{restockItem.stocks}</strong>
            </p>
            <form onSubmit={handleRestockSubmit}>
              <label className="modal_label">
                Quantity to add:
              </label>
              <input
                type="number"
                min="1"
                className="modal_input"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                placeholder="Enter quantity"
                required
                disabled={restockLoading}
              />
              <div className="modal_actions">
                <button
                  type="button"
                  className="modal_cancel"
                  onClick={() => !restockLoading && setRestockItem(null)}
                  disabled={restockLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="modal_confirm" disabled={restockLoading}>
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
