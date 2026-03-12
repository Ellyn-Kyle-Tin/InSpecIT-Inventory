import React from "react"
import "./projects.css"

const sampleProjects = [
  {
    id: 1,
    projectName: "Dragon HQ Renovation",
    description: "Full office renovation",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    status: "Active",
  },
  {
    id: 2,
    projectName: "Branch Expansion",
    description: "New branch in Manila",
    startDate: "2024-03-01",
    endDate: "2024-12-31",
    status: "Active",
  },
  {
    id: 3,
    projectName: "Warehouse Build",
    description: "Storage warehouse La Union",
    startDate: "2023-06-01",
    endDate: "2023-12-01",
    status: "Inactive",
  },
]

const Projects = ({ client, onBack }) => {
  return (
    <div className="projects-container">
      <div className="db-title-project">
        <img src="/project.png" alt="Projects" className="db-title-icon-project" />
        <h1 className="page-header-title-project">Projects</h1>
      </div>

      <div className="projects-subheader">
        <button className="back-btn" onClick={onBack}>← Back to Clients</button>
        <span className="projects-client-label">Client: <strong>{client.clientName}</strong></span>
      </div>

      <button className="add-btn-project">
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
              {sampleProjects.map((project, index) => (
                <tr key={project.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                  <td>{project.projectName}</td>
                  <td>{project.description}</td>
                  <td>{project.startDate}</td>
                  <td>{project.endDate}</td>
                  <td>
                    <span className={`status-badge ${project.status === "Active" ? "status-active" : "status-inactive"}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
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

export default Projects