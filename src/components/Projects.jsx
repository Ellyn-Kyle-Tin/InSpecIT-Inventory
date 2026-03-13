import React, { useState, useEffect } from "react"
import "./projects.css"

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

const Projects = ({ client, onBack }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: '' })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Active'
  })

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects.php?client_id=${client.id}`)
      const data = await res.json()
      if (data.success) {
        setProjects(data.projects || [])
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (client?.id) {
      fetchProjects()
    }
  }, [client])

  const handleAddProject = () => {
    setFormData({ project_name: '', description: '', start_date: '', end_date: '', status: 'Active' })
    setShowAddModal(true)
  }

  const handleViewProject = (project) => {
    // You can implement view functionality here
    // For now, we'll show an alert with project details
    alert(`Project Details:\n\nName: ${project.project_name}\nDescription: ${project.description}\nStart Date: ${project.start_date}\nEnd Date: ${project.end_date}\nStatus: ${project.status}`)
  }

  const handleEditProject = (project) => {
    setSelectedProject(project)
    setFormData({
      project_name: project.project_name,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date,
      status: project.status
    })
    setShowEditModal(true)
  }

  const handleDeleteProject = (project) => {
    setProjectToDelete(project)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return
    
    try {
      const res = await fetch(`${API_BASE}/projects.php?id=${projectToDelete.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        fetchProjects()
        setNotification({ show: true, message: 'Project deleted successfully!' })
      } else {
        setNotification({ show: true, message: data.message || 'Failed to delete project' })
      }
    } catch (err) {
      console.error('Failed to delete project:', err)
      setNotification({ show: true, message: 'Failed to delete project' })
    } finally {
      setShowDeleteConfirm(false)
      setProjectToDelete(null)
    }
  }

  const handleSaveProject = async (isEdit = false) => {
    try {
      const url = `${API_BASE}/projects.php`
      const method = isEdit ? 'PUT' : 'POST'
      const body = {
        client_id: client.id,
        ...formData,
        ...(isEdit && { id: selectedProject.id })
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
        fetchProjects()
        setShowAddModal(false)
        setShowEditModal(false)
        setNotification({ 
          show: true, 
          message: isEdit ? 'Project updated successfully!' : 'Project added successfully!' 
        })
      } else {
        alert(data.message || `Failed to ${isEdit ? 'update' : 'add'} project`)
      }
    } catch (err) {
      console.error(`Failed to ${isEdit ? 'update' : 'add'} project:`, err)
      alert(`Failed to ${isEdit ? 'update' : 'add'} project`)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="projects-container">
      <div className="db-title-project">
        <img src="/client.png" alt="Clients" className="db-title-icon-project" />
        <h1 className="page-header-title-project">{client.client_name}</h1>
      </div>

      <div className="projects-subheader">
        <button className="back-btn" onClick={onBack}>← Back to Clients</button>
      </div>

      <button className="add-btn-project" onClick={handleAddProject}>
        <img src="/add.png" alt="Add" />
        Add Project
      </button>

      <div className="projects-content-card">
        <div className="projects-inner-header">
          <span>PROJECT NAME</span>
          <span>DESCRIPTION</span>
          <span>START DATE</span>
          <span>END DATE</span>
          <span>STATUS</span>
          <span>ACTION</span>
        </div>

        <div className="projects-table-wrapper">
          <table className="projects-table">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="table-loading">Loading projects...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">No projects found for this client.</td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <tr key={project.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                    <td>{project.project_name}</td>
                    <td>{project.description}</td>
                    <td>{project.start_date}</td>
                    <td>{project.end_date}</td>
                    <td>
                      <span className={`status-badge ${project.status === "Active" ? "status-active" : "status-inactive"}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn btn-view" onClick={() => handleViewProject(project)}>View</button>                        <button className="action-btn btn-edit" 
                          onClick={() => handleEditProject(project)}
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn btn-delete" 
                          onClick={() => handleDeleteProject(project)}
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

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="edit-overlay" onClick={() => setShowAddModal(false)}>
          <div className="edit-container" onClick={(e) => e.stopPropagation()}>
            <div className="edit-header">ADD PROJECT</div>
            <form className="edit-body" onSubmit={(e) => { e.preventDefault(); handleSaveProject(false); }}>
              <div className="form-field">
                <label className="edit-label">Project Name:</label>
                <input
                  type="text"
                  name="project_name"
                  className="edit-input"
                  placeholder="Project Name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="edit-label">Description:</label>
                <textarea
                  name="description"
                  className="edit-input"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-field">
                <label className="edit-label">Start Date:</label>
                <input
                  type="date"
                  name="start_date"
                  className="edit-input"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-field">
                <label className="edit-label">End Date:</label>
                <input
                  type="date"
                  name="end_date"
                  className="edit-input"
                  value={formData.end_date}
                  onChange={handleInputChange}
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
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="edit-buttons">
                <button type="submit" className="update-project-btn">Add Project</button>
                <button type="button" className="cancel-project-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    {/* Edit Project Modal */}
{showEditModal && (
  <div className="edit-overlay" onClick={() => setShowEditModal(false)}>
    <div className="edit-container" onClick={(e) => e.stopPropagation()}>
      
      {/* Header */}
      <div className="edit-header">
        EDIT PROJECT
      </div>

      {/* Form Body */}
      <form
        className="edit-body"
        onSubmit={(e) => {
          e.preventDefault()
          handleSaveProject(true)
        }}
      >
        <div className="form-field">
          <label className="edit-label">Project Name:</label>
          <input
            type="text"
            name="project_name"
            className="edit-input"
            placeholder="Project Name"
            value={formData.project_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-field">
          <label className="edit-label">Description:</label>
          <textarea
            name="description"
            className="edit-input"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="form-field">
          <label className="edit-label">Start Date:</label>
          <input
            type="date"
            name="start_date"
            className="edit-input"
            value={formData.start_date}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label className="edit-label">End Date:</label>
          <input
            type="date"
            name="end_date"
            className="edit-input"
            value={formData.end_date}
            onChange={handleInputChange}
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
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="edit-buttons">
          <button type="submit" className="update-project-btn">
            Update Project
          </button>

          <button
            type="button"
            className="cancel-project-btn"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
)}

    {/* Delete Confirmation Modal */}
    <DeleteConfirmModal 
      show={showDeleteConfirm}
      onConfirm={confirmDeleteProject}
      onCancel={() => {
        setShowDeleteConfirm(false)
        setProjectToDelete(null)
      }}
      itemName={projectToDelete?.project_name || ''}
      itemType="Project"
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

export default Projects
