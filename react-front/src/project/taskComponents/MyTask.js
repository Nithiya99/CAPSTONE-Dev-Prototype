import React, { Component } from "react";
import { listmytasks } from "../apiProject";
class MyTasks extends Component {
  state = {
    mytasks: [],
  };
  componentDidMount() {
    listmytasks().then((data) => {
      let allproj = data.userProjects;
      allproj.forEach((proj) => {
        if (proj._id === this.props.projectId) {
          // console.log(proj);
          this.setState({
            mytasks: proj.tasks,
          });
        }
      });
    });
    // this.setState({ mytasks: this.props.project.tasks });
  }

  render() {
    if (this.state.mytasks === undefined || this.state.mytasks.length === 0)
      return <h1>No Tasks</h1>;

    const { mytasks } = this.state;
    // console.log(this.props.proj);
    // console.log(mytasks);

    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th key={"title"}>Title</th>
              <th key={"description"}>Description</th>
              <th key={"op_time"}>Optimistic Time</th>
              <th key={"ml_time"}>Most Likely Time</th>
              <th key={"pess_time"}>Pessimistic Time</th>
            </tr>
          </thead>
          <tbody>
            {mytasks.map(
              (task) =>
                task.taskName !== "Lets Start Working" &&
                task.taskName !== "Completed!!" && (
                  <tr>
                    <td key={"taskname"}> {task.taskName} </td>
                    <td key={"taskdesc"}>{task.taskDescription}</td>
                    <td key={"taskopt"}>{task.optimisticTime}</td>
                    <td key={"taskml"}>{task.mostLikelyTime}</td>
                    <td key={"taskpt"}>{task.pessimisticTime}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MyTasks;
