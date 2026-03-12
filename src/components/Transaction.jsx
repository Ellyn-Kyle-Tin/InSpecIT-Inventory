import React, { useState, useMemo } from "react"
import "./transactions.css"

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
      <div className="db-title">
        <img src="/transactions.png" alt="Transactions" className="db-title-icon" />
        <h1 className="db-title-text">Transactions</h1>
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