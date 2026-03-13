import React, { useState, useEffect } from "react"
import "./clients.css"
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
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="clients-container">
      <div className="db-title-client">
        <img src="/client.png" alt="Clients" className="db-title-icon-client" />
        <h1 className="page-header-title-client">Clients</h1>
      </div>

      <button className="add-btn" onClick={handleAddClient}>
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="table-loading">Loading clients...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-empty">No clients found.</td>
                </tr>
              ) : (
                clients.map((client, index) => (
                  <tr key={client.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                    <td>{client.client_name}</td>
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