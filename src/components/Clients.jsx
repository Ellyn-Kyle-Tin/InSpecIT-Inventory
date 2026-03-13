import React, { useState, useEffect } from "react"
import "./clients.css"

const API = "http://localhost/InSpecIT-Inventory/api/client.php"

const Clients = ({ onSelectClient }) => {
  const [showModal, setShowModal]         = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [clients, setClients]             = useState([])
  const [errors, setErrors]               = useState({})
  const [loading, setLoading]             = useState(false)
  const [apiError, setApiError]           = useState("")

  const [form, setForm] = useState({
    clientName: "",
    address: "",
    tin: "",
    status: "",
  })

  // ─── Fetch all clients ───────────────────────────────────────────────────
  useEffect(() => { fetchClients() }, [])

  const fetchClients = async () => {
    setLoading(true)
    setApiError("")
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setClients(data)
    } catch {
      setApiError("Could not load clients.")
    } finally {
      setLoading(false)
    }
  }

  // ─── Input handler ───────────────────────────────────────────────────────
  const handleInput = (e) => {
    const { name, value } = e.target
    const newErrors = { ...errors }

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

  // ─── Save (create or update) ─────────────────────────────────────────────
  const handleSaveClient = async () => {
    const newErrors = {}
    if (!form.clientName) newErrors.clientName = "Client name required"
    if (!form.address)    newErrors.address    = "Address required"
    if (!form.tin)        newErrors.tin        = "TIN required"
    if (!form.status)     newErrors.status     = "Select status"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload = {
      client_name:    form.clientName,
      client_address: form.address,
      client_tin:     form.tin,
      client_status:  form.status,
    }

    try {
      let res
      if (editingClient) {
        res = await fetch(`${API}?id=${editingClient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error()
      await fetchClients()
      closeModal()
    } catch {
      setApiError("Failed to save client. Please try again.")
    }
  }

  // ─── Edit ────────────────────────────────────────────────────────────────
  const handleEdit = (client) => {
    setForm({
      clientName: client.clientName,
      address:    client.address,
      tin:        client.tin,
      status:     client.status,
    })
    setEditingClient(client)
    setShowModal(true)
  }

  // ─── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async (client) => {
    if (!window.confirm("Delete this client?")) return
    try {
      const res = await fetch(`${API}?id=${client.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await fetchClients()
    } catch {
      setApiError("Failed to delete client. Please try again.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSaveClient()
  }

  const closeModal = () => {
    setShowModal(false)
    setErrors({})
    setApiError("")
    setForm({ clientName: "", address: "", tin: "", status: "" })
    setEditingClient(null)
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="clients-container">

      {showModal && (
        <div className="modal-overlay">
          <div className="add-client-modal">
            <h2>{editingClient ? "EDIT CLIENT" : "ADD CLIENT"}</h2>
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

              {apiError && <p className="error">{apiError}</p>}

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

      {apiError && !showModal && (
        <p className="error" style={{ marginLeft: "-25px" }}>{apiError}</p>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    Loading...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    No clients found.
                  </td>
                </tr>
              ) : (
                clients.map((client, index) => (
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
                        <button className="action-btn btn-edit" onClick={() => handleEdit(client)}>
                          <img src="/edit.png" alt="" className="btn-icon" />
                          Edit
                        </button>
                        <button className="action-btn btn-delete" onClick={() => handleDelete(client)}>
                          <img src="/delete.png" alt="" className="btn-icon" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Clients