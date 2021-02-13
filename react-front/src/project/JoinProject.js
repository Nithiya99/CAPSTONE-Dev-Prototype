import React, { Component } from "react";
import { listprojects } from "./apiPoject";

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
                  <tr>
                    <th>Role Name</th>
                    <th>Skills Required</th>
                    <th>Status</th>
                  </tr>
                  {project.roles.map((role) => (
                    <tr>
                      <td>{role.roleName}</td>
                      <td>{role.roleSkills + ","}</td>
                      <td>
                        <button className="btn btn-outline-primary">
                          Request
                        </button>
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
