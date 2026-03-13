import React, { useState, useEffect } from "react"
import "./clients.css"
<<<<<<< HEAD
import Projects from "./Projects"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/InSpecIT-Inventory/api"

// Simple Delete Confirmation Modal
const DeleteConfirmModal = ({ show, onConfirm, onCancel, itemName, itemType }) => {
  if (!show) return null

  return (
    <div className="delete-confirm-overlay" onClick={onCancel}>
      <div className="delete-confirm-container" onClick={(e) => e.stopPropagation()}>
        <div className="delete-confirm-header">
          <span className="delete-icon">⚠️</span>
          <span>Delete {itemType}</span>
        </div>
        <div className="delete-confirm-body">
          <p>Are you sure you want to delete "{itemName}"?</p>
          {itemType === 'Client' && (
            <p className="delete-warning">This will also delete all associated projects.</p>
          )}
        </div>
        <div className="delete-confirm-buttons">
          <button className="delete-confirm-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="delete-confirm-btn delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

// Simple Notification Component
const Notification = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="notification">
      <div className="notification-content">
        <span className="notification-icon">✓</span>
        <span className="notification-message">{message}</span>
      </div>
    </div>
  )
}

const Clients = ({ onSelectClient }) => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: '' })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [clientToDelete, setClientToDelete] = useState(null)
  const [formData, setFormData] = useState({
    client_name: '',
    address: '',
    tin: '',
    status: 'Active'
  })

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE}/clients.php`)
      const data = await res.json()
      if (data.success) {
        setClients(data.clients || [])
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err)
=======

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
>>>>>>> 5826d8b0ce67914c381264206e4f0e78e5d96f74
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  useEffect(() => {
    fetchClients()
  }, [])

  const handleAddClient = () => {
    setFormData({ client_name: '', address: '', tin: '', status: 'Active' })
    setShowAddModal(true)
  }

  const handleEditClient = (client) => {
    setSelectedClient(client)
    setFormData({
      client_name: client.client_name,
      address: client.address,
      tin: client.tin,
      status: client.status
    })
    setShowEditModal(true)
  }

  const handleDeleteClient = (client) => {
    setClientToDelete(client)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return
    
    try {
      // First delete all projects associated with this client
      const projectsRes = await fetch(`${API_BASE}/projects.php?client_id=${clientToDelete.id}`, {
        method: 'DELETE'
      })
      
      // Then delete the client
      const clientRes = await fetch(`${API_BASE}/clients.php?id=${clientToDelete.id}`, {
        method: 'DELETE'
      })
      
      const clientData = await clientRes.json()
      if (clientData.success) {
        fetchClients()
        setNotification({ show: true, message: 'Client and all associated projects deleted successfully!' })
      } else {
        setNotification({ show: true, message: clientData.message || 'Failed to delete client' })
      }
    } catch (err) {
      console.error('Failed to delete client:', err)
      setNotification({ show: true, message: 'Failed to delete client' })
    } finally {
      setShowDeleteConfirm(false)
      setClientToDelete(null)
    }
  }

  const handleSaveClient = async (isEdit = false) => {
    try {
      const url = `${API_BASE}/clients.php`
      const method = isEdit ? 'PUT' : 'POST'
      const body = {
        ...formData,
        ...(isEdit && { id: selectedClient.id })
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (data.success) {
        fetchClients()
        setShowAddModal(false)
        setShowEditModal(false)
        setNotification({ 
          show: true, 
          message: isEdit ? 'Client updated successfully!' : 'Client added successfully!' 
        })
      } else {
        setNotification({ show: true, message: data.message || `Failed to ${isEdit ? 'update' : 'add'} client` })
      }
    } catch (err) {
      console.error(`Failed to ${isEdit ? 'update' : 'add'} client:`, err)
      setNotification({ show: true, message: `Failed to ${isEdit ? 'update' : 'add'} client` })
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

=======
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
>>>>>>> 5826d8b0ce67914c381264206e4f0e78e5d96f74
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

<<<<<<< HEAD
      <button className="add-btn" onClick={handleAddClient}>
=======
      <button className="add-btn" onClick={() => setShowModal(true)}>
>>>>>>> 5826d8b0ce67914c381264206e4f0e78e5d96f74
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
<<<<<<< HEAD
                  <td colSpan={5} className="table-loading">Loading clients...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-empty">No clients found.</td>
=======
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    Loading...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    No clients found.
                  </td>
>>>>>>> 5826d8b0ce67914c381264206e4f0e78e5d96f74
                </tr>
              ) : (
                clients.map((client, index) => (
                  <tr key={client.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
<<<<<<< HEAD
                    <td>{client.client_name}</td>
=======
                    <td>{client.clientName}</td>
>>>>>>> 5826d8b0ce67914c381264206e4f0e78e5d96f74
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
<<<<<<< HEAD
                          onClick={() => onSelectClient(client)}
                        >
                          Projects
                        </button>
                        <button
                          className="action-btn btn-edit"
                          onClick={() => handleEditClient(client)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDeleteClient(client)}
                        >
=======
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
>>>>>>> 5826d8b0ce67914c381264206e4f0e78e5d96f74
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

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="edit-overlay" onClick={() => setShowAddModal(false)}>
          <div className="edit-container" onClick={(e) => e.stopPropagation()}>
            <div className="edit-header">ADD CLIENT</div>
            <form className="edit-body" onSubmit={(e) => { e.preventDefault(); handleSaveClient(false); }}>
              <div className="form-field">
                <label className="edit-label">Client Name:</label>
                <input
                  type="text"
                  name="client_name"
                  className="edit-input"
                  placeholder="Client Name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="edit-label">Address:</label>
                <textarea
                  name="address"
                  className="edit-input"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="form-field">
                <label className="edit-label">TIN:</label>
                <input
                  type="text"
                  name="tin"
                  className="edit-input"
                  placeholder="TIN"
                  value={formData.tin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="edit-label">Status:</label>
                <select
                  name="status"
                  className="edit-input"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="edit-buttons">
                <button type="submit" className="update-project-btn">Add Client</button>
                <button type="button" className="cancel-project-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && (
        <div className="edit-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-container" onClick={(e) => e.stopPropagation()}>
            <div className="edit-header">EDIT CLIENT</div>
            <form className="edit-body" onSubmit={(e) => { e.preventDefault(); handleSaveClient(true); }}>
              <div className="form-field">
                <label className="edit-label">Client Name:</label>
                <input
                  type="text"
                  name="client_name"
                  className="edit-input"
                  placeholder="Client Name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="edit-label">Address:</label>
                <textarea
                  name="address"
                  className="edit-input"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="form-field">
                <label className="edit-label">TIN:</label>
                <input
                  type="text"
                  name="tin"
                  className="edit-input"
                  placeholder="TIN"
                  value={formData.tin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="edit-label">Status:</label>
                <select
                  name="status"
                  className="edit-input"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="edit-buttons">
                <button type="submit" className="update-project-btn">Update Client</button>
                <button type="button" className="cancel-project-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        show={showDeleteConfirm}
        onConfirm={confirmDeleteClient}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setClientToDelete(null)
        }}
        itemName={clientToDelete?.client_name || ''}
        itemType="Client"
      />
      
      {/* Notification */}
      <Notification 
        message={notification.message} 
        show={notification.show} 
        onClose={() => setNotification({ show: false, message: '' })} 
      />
    </div>
  )
}

export default Clients