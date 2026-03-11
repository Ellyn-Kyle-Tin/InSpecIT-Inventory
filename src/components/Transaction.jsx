import React from "react"
import "./transactions.css"
import { FiFileText } from "react-icons/fi"

const Transaction = () => {
  return (
    <div className="transaction-records">
      <div className="page-header">
        <FiFileText size={32} className="page-header-icon1" />
        <h1 className="page-header">TRANSACTIONS</h1>
      </div>
    </div>
  );
};

export default Transaction;
