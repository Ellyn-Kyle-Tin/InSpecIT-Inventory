import React from "react"
import "./inventory.css"

const Inventory = ({ userName }) => {
  return (
    <div className="inventory">
      <div className="db-title1">
        <img src="/inventory.png" alt="Inventory" className="db-title-icon1" />
        <h1 className="db-title-text1">Inventory</h1>
      </div>
    </div>
  )
}

export default Inventory
