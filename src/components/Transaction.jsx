import React, { useState } from "react"
import "./transactions.css"
import { FiFileText } from "react-icons/fi"

const Transaction = () => {
  const [activeTab, setActiveTab] = useState("order-history");

  const tabs = [
    { id: "order-history", label: "ORDER HISTORY" },
    { id: "user-history", label: "USER HISTORY" },
    { id: "logs", label: "LOGS" },
  ];

  return (
    <div className="transaction-records">
      <div className="page-header-wrapper">
        <FiFileText size={32} className="page-header-icon4" />
        <h1 className="page-header-title-trans">LOVE KO TO</h1>
      </div>

      <nav className="transaction-navbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`transaction-nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="transactions-content-card">
        <div className="transactions-inner-header">
          <span>DATE & TIME</span>
          <span>CLIENT NAME</span>
          <span>ITEMS</span>
          <span>TOTAL AMOUNT</span>
          <span>STATUS</span>
        </div>
      </div>
    </div>
  );
};

export default Transaction;