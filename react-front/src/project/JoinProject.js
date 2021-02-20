import React, { Component } from "react";
import { listprojects, request } from "./apiProject";
import { getCurrentUser } from "../user/apiUser";
import Badge from "react-bootstrap/Badge";
class JoinProject extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    listprojects().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ projects: data });
      }
    });
  }

  render() {
    const { projects } = this.state;

    return (
      <div className="mt-5">
        <h2>Join Projects</h2>
        {projects.map((project, i) => (
          <div className="card mt-4 mb-4">
            <div className="card-header">
              <h5>
                <strong>{project.title}</strong>
              </h5>
            </div>
            <div className="card-body">
              <h6 className="card-title">
                <strong>Project Description: </strong>
                {project.description}
              </h6>
              <p className="card-text">
                <strong>Skills required: </strong>
                {project.skills}
              </p>
              <table className="table">
                <thead>
                  <tr key={"title"}>
                    <th key={"rolename"}>Role Name</th>
                    <th key={"skills"}>Skills Required</th>
                    <th key={"status"}>Status</th>
                  </tr>
                  {project.roles.map((role) => (
                    <tr key={role._id.toString()}>
                      <td key={role._id.toString() + role.roleName.toString()}>
                        {role.roleName}
                      </td>
                      <td
                        key={role._id.toString() + role.roleSkills.toString()}
                      >
                        {role.roleSkills + ","}
                      </td>
                      <td>
                        {role.assignedTo !== undefined ? (
                          <Badge pill variant="warning">
                            Position Full
                          </Badge>
                        ) : (
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              getCurrentUser()._id === project.leader
                                ? alert("Leaders cant request bruh!")
                                : request(
                                    getCurrentUser()._id,
                                    project._id,
                                    role._id
                                  );
                            }}
                          >
                            Request
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </thead>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default JoinProject;
