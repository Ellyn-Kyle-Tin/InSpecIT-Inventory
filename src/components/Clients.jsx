import React, { useState } from "react"
import "./clients.css"

const sampleClients = [
  {
    id: 1,
    clientName: "Royal Dragon",
    address: "McArthur Highway, Brgy. Udiao, Rosario, La Union, Philippines",
    tin: "1234-36272-134",
    status: "Active",
  },
  {
    id: 2,
    clientName: "Solar Phil",
    address: "20th Floor AIA Tower (formerly Philam Life Tower) 8767 Paseo De Roxas, Makati City, Philippines",
    tin: "4321-36272-134",
    status: "Active",
  },
  {
    id: 3,
    clientName: "Royal Dragon",
    address: "McArthur Highway, Brgy. Udiao, Rosario, La Union, Philippines",
    tin: "1234-36272-134",
    status: "Inactive",
  },
  {
    id: 4,
    clientName: "Solar Phil",
    address: "20th Floor AIA Tower (formerly Philam Life Tower) 8767 Paseo De Roxas, Makati City, Philippines",
    tin: "4321-36272-134",
    status: "Inactive",
  },
]

const Clients = ({ onSelectClient }) => {
  const [showModal, setShowModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [clients, setClients] = useState(sampleClients)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    clientName: "",
    address: "",
    tin: "",
    status: "",
  })

  const handleInput = (e) => {
    const { name, value } = e.target
    let newErrors = { ...errors }

    if (name === "clientName") {
      if (/[^a-zA-Z\s]/.test(value)) {
        newErrors[name] = "Only letters allowed"
        setErrors(newErrors)
        return
      } else {
        delete newErrors[name]
      }
    }

    if (name === "status" && value === "") {
      newErrors.status = "Please select a status"
    } else {
      delete newErrors[name]
    }

    setErrors(newErrors)
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveClient = () => {
    let newErrors = {}

    if (!form.clientName) newErrors.clientName = "Client name required"
    if (!form.address) newErrors.address = "Address required"
    if (!form.tin) newErrors.tin = "TIN required"
    if (!form.status) newErrors.status = "Select status"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newClient = {
      id: Date.now(),
      clientName: form.clientName,
      address: form.address,
      tin: form.tin,
      status: form.status,
    }

    if (editingIndex !== null) {
      const updated = [...clients]
      updated[editingIndex] = newClient
      setClients(updated)
      setEditingIndex(null)
    } else {
      setClients(prev => [...prev, newClient])
    }

    setShowModal(false)
    setForm({ clientName: "", address: "", tin: "", status: "" })
    setErrors({})
  }

  const handleEdit = (index) => {
    const client = clients[index]
    setForm({
      clientName: client.clientName,
      address: client.address,
      tin: client.tin,
      status: client.status,
    })
    setEditingIndex(index)
    setShowModal(true)
  }

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Delete this client?")
    if (!confirmDelete) return
    setClients(clients.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSaveClient()
  }

  const closeModal = () => {
    setShowModal(false)
    setErrors({})
    setForm({ clientName: "", address: "", tin: "", status: "" })
    setEditingIndex(null)
  }

  return (
    <div className="clients-container">

      {showModal && (
        <div className="modal-overlay">
          <div className="add-client-modal">
            <h2>{editingIndex !== null ? "EDIT CLIENT" : "ADD CLIENT"}</h2>
            <form className="modal-form" onSubmit={handleSubmit}>

              <div className="form-row">
                <label>Client Name</label>
                <input name="clientName" value={form.clientName} onChange={handleInput} />
                {errors.clientName && <p className="error">{errors.clientName}</p>}
              </div>

              <div className="form-row">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleInput} />
                {errors.address && <p className="error">{errors.address}</p>}
              </div>

              <div className="form-row">
                <label>TIN</label>
                <input name="tin" value={form.tin} onChange={handleInput} />
                {errors.tin && <p className="error">{errors.tin}</p>}
              </div>

              <div className="form-row">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleInput}>
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <p className="error">{errors.status}</p>}
              </div>

              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              </div>

            </form>
          </div>
        </div>
      )}

      <div className="db-title-client">
        <img src="/client.png" alt="Clients" className="db-title-icon-client" />
        <h1 className="page-header-title-client">Clients</h1>
      </div>

      <button className="add-btn" onClick={() => setShowModal(true)}>
        <img src="/add.png" alt="Add" />
        Add Client
      </button>

      <div className="clients-content-card">
        <div className="clients-table-wrapper">
          <table className="clients-table">
            <thead>
              <tr className="clients-inner-header">
                <th>CLIENT NAME</th>
                <th>ADDRESS</th>
                <th>TIN</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
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
                        onClick={() => onSelectClient && onSelectClient(client)}
                      >
                        <img src="/project.png" alt="" className="btn-icon" />
                        Projects
                      </button>
                      <button className="action-btn btn-edit" onClick={() => handleEdit(index)}>
                        <img src="/edit.png" alt="" className="btn-icon" />
                        Edit
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(index)}>
                        <img src="/delete.png" alt="" className="btn-icon" />
                        Delete
                      </button>
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