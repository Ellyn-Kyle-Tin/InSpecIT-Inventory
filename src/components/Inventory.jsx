import React from "react"
import "./inventory.css"

const Inventory = ({ userName }) => {
  return (
    <div className="inventory">
      <div className="page-header">
        <img src="/inventory.png" alt="Inventory" className="page-header-icon1" />
        <h1 className="page-header">INVENTORY</h1>
      </div>
    </div>
  )
}

export default Inventory
