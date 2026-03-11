import React from "react";
import "./products.css";

const Products = () => {
  const data = Array(8).fill({
    code: "SH-1C120-TxL-A1BK",
    name: "Cable",
    desc: "1 CORE x 120 MM2 BLACK COLOR",
    category: "Hardware",
    price: "Php 4,500.00",
    stock: 3,
    min: 3
  });

  return (
    <div className="products-container">

      {/* HEADER */}
      <div className="products-top">

        <div className="products-title">
          <img src="/product.png" alt="product" />
          <h2>Products</h2>
        </div>

        <div className="products-search">
          <input type="text" placeholder="Search" />
          <img src="/search.png" alt="search" />
        </div>

      </div>

      {/* CONTROLS */}
      <div className="products-controls">

        <button className="date-btn">
          <img src="/calendar.png" alt="calendar" />
          02 March 2026
        </button>

        <button className="add-btn">
          <img src="/add.png" alt="add" />
          Add Product
        </button>

      </div>

      {/* TABLE */}
      <div className="products-table-wrapper">

        <table className="products-table">

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
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.desc}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
                <td>{item.min}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Products;