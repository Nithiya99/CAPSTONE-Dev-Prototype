import React, { Component } from "react";

class ProjectDashboard extends Component {
  render() {
    if (this.props.location.state.project === undefined) {
      return null;
    }
    const { project } = this.props.location.state;
    // console.log(project);
    // console.log(this.props.location);
    return (
      <div className="mt-5">
        <h1>{project.title}'s Dasboard</h1>
      </div>
    );
  }
}

export default ProjectDashboard;
