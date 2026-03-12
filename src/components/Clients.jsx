import React, { useState } from "react"
import "./clients.css"
import Projects from "./projects"

const sampleClients = [
  {
    id: 1,
    clientName: "Royal Dragon",
    address: "McArthur Highway, Brgy. Udiao, Rosario, La Union, Philippines",
    tin: "1234-36272-134",
    status: "Active",
  },
]

const Clients = ({ onSelectClient }) => {
  return (
    <div className="clients-container">
      <div className="db-title-client">
        <img src="/client.png" alt="Clients" className="db-title-icon-client" />
        <h1 className="page-header-title-client">Clients</h1>
      </div>

      <button className="add-btn">
        <img src="/add.png" alt="Add" />
        Add Client
      </button>

      <div className="clients-content-card">
        <div className="transactions-inner-header">
          <span>CLIENT NAME</span>
          <span>ADDRESS</span>
          <span>TIN</span>
          <span>STATUS</span>
          <span>ACTION</span>
        </div>

        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <tbody>
              {sampleClients.map((client, index) => (
                <tr key={client.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                  <td>{client.clientName}</td>
                  <td>{client.address}</td>
                  <td>{client.tin}</td>
                  <td>
                    <span className={`status-badge ${client.status === "Active" ? "status-active" : "status-inactive"}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn btn-projects"
                        onClick={() => onSelectClient(client)}
                      >
                        Projects
                      </button>
                      <button className="action-btn btn-edit">Edit</button>
                      <button className="action-btn btn-delete">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Clients