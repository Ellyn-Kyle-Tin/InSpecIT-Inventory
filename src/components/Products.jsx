import React from "react";
import "./products.css";

const Products = () => {
  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <img src="/logo.png" alt="Inspect Logo"/>
        </div>

        <ul className="menu">

          <li>
            <img src="/dashboard.png" alt="dashboard"/>
            <span>DASHBOARD</span>
          </li>

          <li>
            <img src="/inventory.png" alt="inventory"/>
            <span>INVENTORY</span>
          </li>

          <li className="active">
            <img src="/product.png" alt="products"/>
            <span>PRODUCTS</span>
          </li>

          <li>
            <img src="/transactions.png" alt="transactions"/>
            <span>TRANSACTIONS</span>
          </li>

          <li>
            <img src="/client.png" alt="client"/>
            <span>CLIENT</span>
          </li>

        </ul>

        <div className="logout">
          <img src="/logout.png" alt="logout"/>
          <span>LOG OUT</span>
        </div>

      </aside>


      {/* MAIN CONTENT */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <button className="admin-btn">Admin</button>
        </div>


        {/* CONTENT */}
        <div className="content">

          {/* HEADER */}
          <div className="products-header">

            <div className="title">
              <h2>📦 Products</h2>
            </div>

            <div className="search">
              <input type="text" placeholder="Search"/>
              <img src="/search.png" alt="search"/>
            </div>

          </div>


          {/* CONTROLS */}
          <div className="controls">

            <button className="date-btn">
              <img src="/calendar.png" alt="calendar"/>
              02 March 2026
            </button>

            <button className="add-btn">
              <img src="/add.png" alt="add"/>
              Add Product
            </button>

          </div>


          {/* TABLE */}
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>NO.</th>
                  <th>NAME</th>
                  <th>DESCRIPTION</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>MIN STOCK</th>
                </tr>
              </thead>

              <tbody>

                {Array(7).fill().map((_, index) => (
                  <tr key={index}>
                    <td>SH-1C120-TxL-A1BK</td>
                    <td>Cable</td>
                    <td>1 CORE x 120 MM2 BLACK COLOR</td>
                    <td>Hardware</td>
                    <td>Php 4,500.00</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Products;