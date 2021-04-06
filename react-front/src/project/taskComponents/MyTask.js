import React, { Component } from "react";
import { listmytasks } from "../apiProject";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import EditModel from "./EditModel";
import { deleteTask } from "../apiProject";

class MyTasks extends Component {
  state = {
    mytasks: [],
    currentTask: {},
    show: false,
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
  showMe = () => {
    this.setState({ show: true });
  };
  hideMe = () => {
    this.setState({ show: false });
  };
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
              <th key={"edit"}>Edit</th>
              <th key={"delete"}>Delete</th>
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
                    <td key={"editpt" + task._id}>
                      <EditIcon
                        onClick={() => {
                          this.showMe();
                          this.setState({ currentTask: task });
                        }}
                      />
                      {this.state.show ? (
                        <EditModel
                          projectId={this.props.projectId}
                          task={this.state.currentTask}
                          id={task._id}
                          show={this.state.show}
                          showMe={this.showMe}
                          hideMe={this.hideMe}
                        />
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td key={"deletept"}>
                      <DeleteIcon
                        onClick={() => {
                          let response = window.confirm("Are you Sure?");
                          if (response) {
                            deleteTask(task._id, this.props.projectId)
                              .then((data) => {
                                console.log(data);
                              })
                              .then(() => window.location.reload());
                          }
                        }}
                      />
                    </td>
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
