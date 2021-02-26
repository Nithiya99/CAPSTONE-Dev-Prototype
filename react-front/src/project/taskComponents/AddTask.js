import React, { Component } from "react";

class AddTask extends Component {
  constructor() {
    super();
    this.state = {
      task_title: "",
      task_description: "",
      task_responsible: "",
      task_completed: false,
      task_optimistic: "",
      task_pessimistic: "",
      task_mostLikely: "",
    };
  }

  onChangeTaskTitle = (e) => {
    this.setState({ task_title: e.target.value });
  };

  onChangeTaskDescription = (e) => {
    this.setState({ task_description: e.target.value });
  };

  onChangeTaskResponsible = (e) => {
    this.setState({ task_responsible: e.target.value });
  };

  onChangeTaskOptimistic = (e) => {
    this.setState({ task_optimistic: e.target.value });
  };

  onChangeTaskPessimistic = (e) => {
    this.setState({ task_pessimistic: e.target.value });
  };

  onChangeTaskMostLikely = (e) => {
    this.setState({ task_mostLikely: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    console.log("Task Created:");
    console.log(`Task Title: ${this.state.task_title}`);
    console.log(`Task Description: ${this.state.task_description}`);
    console.log(`Task Assigned To: ${this.state.task_responsible}`);
    console.log(`Optimistic Time: ${this.state.task_optimistic}`);
    console.log(`Pessimistic Time: ${this.state.task_pessimistic}`);
    console.log(`Most Likely Time: ${this.state.task_mostLikely}`);

    const newTask = {
      task_title: this.state.task_title,
      task_description: this.state.task_description,
      task_responsible: this.state.task_responsible,
      task_optimistic: this.state.task_optimistic,
      task_pessimistic: this.state.task_pessimistic,
      task_mostLikely: this.state.task_mostLikely,
      task_completed: this.state.task_completed,
    };

    this.setState({
      task_title: "",
      task_description: "",
      task_responsible: "",
      task_completed: false,
      task_optimistic: "",
      task_pessimistic: "",
      task_mostLikely: "",
    });
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>Task Title: </label>
          <input
            type="text"
            className="form-control"
            value={this.state.task_title}
            onChange={this.onChangeTaskTitle}
          />
        </div>
        <div className="form-group">
          <label>Task Description: </label>
          <input
            type="text"
            className="form-control"
            value={this.state.task_description}
            onChange={this.onChangeTaskDescription}
          />
        </div>
        <div className="form-group">
          <label>Assign To: </label>
          <input
            type="text"
            className="form-control"
            value={this.state.task_responsible}
            onChange={this.onChangeTaskResponsible}
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label>Optmistic Time: </label>
            <input
              type="number"
              className="form-control "
              value={this.state.task_optimistic}
              onChange={this.onChangeTaskOptimistic}
            />
          </div>
          <div className="form-group col-md-4">
            <label>Most Likely Time: </label>
            <input
              type="number"
              className="form-control"
              value={this.state.task_mostLikely}
              onChange={this.onChangeTaskMostLikely}
            />
          </div>
          <div className="form-group col-md-4">
            <label>Pessimistic Time: </label>
            <input
              type="number"
              className="form-control"
              value={this.state.task_pessimistic}
              onChange={this.onChangeTaskPessimistic}
            />
          </div>
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Create Task"
            className="btn btn-primary"
          />
        </div>
      </form>
    );
  }
}

export default AddTask;
