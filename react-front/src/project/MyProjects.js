import React, { Component } from "react";
import { list } from "../user/apiUser";
import { listmyprojects } from "./apiProject";

class MyProjects extends Component {
  state = {
    myProjects: [],
    currentProject: {},
  };
  componentDidMount() {
    listmyprojects().then((data) => [console.log(data)]);
  }
  renderProject(project) {
    return <h5>{project.title}</h5>;
  }
  render() {
    if (this.state.myProjects === undefined) return null;
    return (
      <div className="mt-5">
        <h2>My Projects</h2>
        <div className="card mt-4 mb-4">
          <div className="card-header">
            {this.state.myProjects.map((project) => {
              this.renderProject(project);
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default MyProjects;
