import React from "react"
import "./transactions.css"
import { FiFileText } from "react-icons/fi"

const TransactionRecords = () => {
  return (
    <div className="transaction-records">
      <div className="page-header">
        <FiFileText size={32} className="page-header-icon" />
        <h1 className="page-header-title">TRANSACTIONS</h1>
      </div>
    </div>
  )
};

export default TransactionRecords;
