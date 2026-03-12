import React, { useState, useMemo } from "react"
import "./transactions.css"
<<<<<<< HEAD
=======
import { FiFileText, FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi"

const tabHeaders = {
  "order-history": ["DATE & TIME", "CLIENT NAME", "ITEMS", "TOTAL AMOUNT", "STATUS"],
  "user-history":  ["DATE", "TIME", "EMPLOYEE", "ROLE"],
  "logs":          ["DATE", "TIME", "MOVEMENT", "EMPLOYEE"],
};

const sampleData = {
  "order-history": [
    { id: 1,  col1: "2025-06-10, 08:32 AM", col2: "Maria Santos",    col3: "1 CORE x 120 MM2 BLACK COLOR", col4: "₱320.00", status: "Delivered"  },
    { id: 2,  col1: "2025-06-10, 09:15 AM", col2: "Juan dela Cruz",  col3: "2 CORE x 95 MM2 RED COLOR",    col4: "₱215.00", status: "In Transit" },
    { id: 3,  col1: "2025-06-10, 10:02 AM", col2: "Ana Reyes",       col3: "3 CORE x 70 MM2 BLUE COLOR",   col4: "₱480.00", status: "Delivered"  },
    { id: 4,  col1: "2025-06-10, 11:45 AM", col2: "Pedro Lim",       col3: "4 CORE x 50 MM2 WHITE COLOR",  col4: "₱560.00", status: "Pending"    },
    { id: 5,  col1: "2025-06-10, 12:30 PM", col2: "Rosa Villanueva", col3: "1 CORE x 35 MM2 GREEN COLOR",  col4: "₱390.00", status: "In Transit" },
    { id: 6,  col1: "2025-06-10, 01:10 PM", col2: "Carlos Mendoza",  col3: "2 CORE x 25 MM2 BLACK COLOR",  col4: "₱270.00", status: "Pending"    },
    { id: 7,  col1: "2025-06-10, 01:10 PM", col2: "Carlos Mendoza",  col3: "2 CORE x 25 MM2 BLACK COLOR",  col4: "₱270.00", status: "Pending"    },
    { id: 8,  col1: "2025-06-10, 01:10 PM", col2: "Carlos Mendoza",  col3: "2 CORE x 25 MM2 BLACK COLOR",  col4: "₱270.00", status: "Pending"    },
    { id: 9,  col1: "2025-06-10, 01:10 PM", col2: "Carlos Mendoza",  col3: "2 CORE x 25 MM2 BLACK COLOR",  col4: "₱270.00", status: "Pending"    },
    { id: 10, col1: "2025-06-10, 01:10 PM", col2: "Carlos Mendoza",  col3: "2 CORE x 25 MM2 BLACK COLOR",  col4: "₱270.00", status: "Pending"    },
    { id: 11, col1: "2025-06-10, 01:10 PM", col2: "Carlos Mendoza",  col3: "2 CORE x 25 MM2 BLACK COLOR",  col4: "₱270.00", status: "Pending"    },
  ],
  "user-history": [
    { id: 1,  col1: "2025-06-09", col2: "08:00 AM", col3: "J. dela Cruz", col4: "Technical Specialist 1" },
    { id: 2,  col1: "2025-06-09", col2: "09:45 AM", col3: "M. Santos",    col4: "Sales Engineer"         },
    { id: 3,  col1: "2025-06-09", col2: "11:20 AM", col3: "A. Reyes",     col4: "SCADA Programmer 1"     },
    { id: 4,  col1: "2025-06-09", col2: "01:00 PM", col3: "P. Reyes",     col4: "Sales Engineer"         },
    { id: 5,  col1: "2025-06-09", col2: "03:30 PM", col3: "C. Mendoza",   col4: "Technical Specialist 1" },
    { id: 6,  col1: "2025-06-09", col2: "03:30 PM", col3: "C. Mendoza",   col4: "Technical Specialist 1" },
    { id: 7,  col1: "2025-06-09", col2: "03:30 PM", col3: "C. Mendoza",   col4: "Technical Specialist 1" },
    { id: 8,  col1: "2025-06-09", col2: "03:30 PM", col3: "C. Mendoza",   col4: "Technical Specialist 1" },
    { id: 9,  col1: "2025-06-09", col2: "03:30 PM", col3: "C. Mendoza",   col4: "Technical Specialist 1" },
    { id: 10, col1: "2025-06-09", col2: "03:30 PM", col3: "C. Mendoza",   col4: "Technical Specialist 1" },
    { id: 11, col1: "2025-06-09", col2: "03:30 PM", col3: "C. Mendoza",   col4: "Technical Specialist 1" },
  ],
  "logs": [
    {
      id: 1, col1: "2025-06-10", col2: "08:32 AM", col4: "M. Santos",
      movement: { type: "ORDER", quantity: 3, items: [
        { name: "1 CORE x 120 MM2 BLACK COLOR", qty: 2 },
        { name: "2 CORE x 95 MM2 RED COLOR",    qty: 1 },
      ]},
    },
    {
      id: 2, col1: "2025-06-10", col2: "09:15 AM", col4: "P. Reyes",
      movement: { type: "ORDER", quantity: 1, items: [
        { name: "3 CORE x 70 MM2 BLUE COLOR", qty: 1 },
      ]},
    },
    {
      id: 3, col1: "2025-06-10", col2: "10:05 AM", col4: "A. Reyes",
      movement: { type: "STOCK+", quantity: 50, items: [
        { name: "1 CORE x 120 MM2 BLACK COLOR", qty: 20 },
        { name: "4 CORE x 50 MM2 WHITE COLOR",  qty: 30 },
      ]},
    },
    {
      id: 4, col1: "2025-06-10", col2: "11:00 AM", col4: "J. dela Cruz",
      movement: { type: "STOCK-", quantity: 10, items: [
        { name: "2 CORE x 25 MM2 BLACK COLOR", qty: 10 },
      ]},
    },
    {
      id: 5, col1: "2025-06-10", col2: "11:45 AM", col4: "J. dela Cruz",
      movement: { type: "ORDER", quantity: 4, items: [
        { name: "1 CORE x 35 MM2 GREEN COLOR", qty: 2 },
        { name: "2 CORE x 95 MM2 RED COLOR",   qty: 1 },
        { name: "4 CORE x 50 MM2 WHITE COLOR", qty: 1 },
      ]},
    },
    {
      id: 6, col1: "2025-06-10", col2: "01:10 PM", col4: "C. Mendoza",
      movement: { type: "STOCK+", quantity: 25, items: [
        { name: "3 CORE x 70 MM2 BLUE COLOR", qty: 25 },
      ]},
    },
    {
      id: 7, col1: "2025-06-10", col2: "01:10 PM", col4: "C. Mendoza",
      movement: { type: "STOCK+", quantity: 25, items: [
        { name: "3 CORE x 70 MM2 BLUE COLOR", qty: 25 },
      ]},
    },
    {
      id: 8, col1: "2025-06-10", col2: "01:10 PM", col4: "C. Mendoza",
      movement: { type: "STOCK+", quantity: 25, items: [
        { name: "3 CORE x 70 MM2 BLUE COLOR", qty: 25 },
      ]},
    },
    {
      id: 9, col1: "2025-06-10", col2: "01:10 PM", col4: "C. Mendoza",
      movement: { type: "STOCK+", quantity: 25, items: [
        { name: "3 CORE x 70 MM2 BLUE COLOR", qty: 25 },
      ]},
    },
    {
      id: 10, col1: "2025-06-10", col2: "01:10 PM", col4: "C. Mendoza",
      movement: { type: "STOCK+", quantity: 25, items: [
        { name: "3 CORE x 70 MM2 BLUE COLOR", qty: 25 },
      ]},
    },
    {
      id: 11, col1: "2025-06-10", col2: "01:10 PM", col4: "C. Mendoza",
      movement: { type: "STOCK+", quantity: 25, items: [
        { name: "3 CORE x 70 MM2 BLUE COLOR", qty: 25 },
      ]},
    },
  ],
};

const statusClass = (status) => {
  const map = {
    "Delivered":  "status-delivered",
    "In Transit": "status-in-transit",
    "Pending":    "status-pending",
  };
  return map[status] || "";
};

const MovementCell = ({ movement }) => {
  const [open, setOpen] = useState(false);
  const isOrder = movement.type === "ORDER";
  const hasMultiple = movement.items.length > 1;
  const isDroppable = isOrder && hasMultiple;

  const quantityDisplay =
    movement.type === "STOCK-"
      ? `STOCK -${movement.quantity}`
      : movement.type === "STOCK+"
      ? `STOCK +${movement.quantity}`
      : `${movement.type} +${movement.quantity}`;

  return (
    <div className="movement-cell">
      <div
        className={`movement-label ${isDroppable ? "movement-clickable" : ""}`}
        onClick={() => isDroppable && setOpen(!open)}
      >
        <span className="movement-type">{quantityDisplay}</span>
        {isDroppable && (
          <span className="movement-chevron">
            {open ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
          </span>
        )}
      </div>
      {open && (
        <div className="movement-dropdown">
          {movement.items.map((item, i) => (
            <div key={i} className="movement-dropdown-item">
              <span className="movement-item-name">{item.name}</span>
              <span className="movement-item-qty">x{item.qty}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
>>>>>>> f65e6d6ee4c17645268bbb2ab5a749ef01f9ec7d

const Transaction = () => {
  const [activeTab, setActiveTab]     = useState("order-history");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "order-history", label: "ORDER HISTORY" },
    { id: "user-history",  label: "USER HISTORY"  },
    { id: "logs",          label: "LOGS"           },
  ];

  const allRows = sampleData[activeTab] || [];
  const headers = tabHeaders[activeTab] || [];

  const rows = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allRows;

    return allRows.filter((row) => {
      const baseMatch = [row.col1, row.col2, row.col3, row.col4, row.status]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(q));

      const movementMatch =
        row.movement &&
        (row.movement.type.toLowerCase().includes(q) ||
          row.movement.items.some((item) =>
            item.name.toLowerCase().includes(q)
          ));

      return baseMatch || movementMatch;
    });
  }, [activeTab, searchQuery, allRows]);

  return (
    <div className="transaction-records">
<<<<<<< HEAD
      <div className="db-title">
        <img src="/transactions.png" alt="Transactions" className="db-title-icon" />
        <h1 className="db-title-text">Transactions</h1>
=======
      <div className="page-header-wrapper">
        <FiFileText size={32} className="page-header-icon4" />
        <h1 className="page-header-title-trans">Transactions</h1>
>>>>>>> f65e6d6ee4c17645268bbb2ab5a749ef01f9ec7d
      </div>

      <div className="transactions-topbar">
        <nav className="transaction-navbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`transaction-nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="transactions-search">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="transactions-search-icon" />
        </div>
      </div>

      <div className="transactions-content-card">
        <div className="transactions-inner-header">
          {headers.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <colgroup>
              {headers.map((_, i) => (
                <col key={i} style={{ width: `${100 / headers.length}%` }} />
              ))}
            </colgroup>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                    <td>{row.col1}</td>
                    <td>{row.col2}</td>
                    {activeTab === "logs" ? (
                      <>
                        <td className="movement-td">
                          <MovementCell movement={row.movement} />
                        </td>
                        <td>{row.col4}</td>
                      </>
                    ) : (
                      <>
                        <td>{row.col3}</td>
                        <td>{row.col4}</td>
                      </>
                    )}
                    {activeTab === "order-history" && (
                      <td>
                        <span className={`status-badge ${statusClass(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="no-results">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;