import React, { Component } from "react";
import { updateProject } from "./apiProject";
import { Button } from "react-bootstrap";
import { getCurrentUser } from "./../user/apiUser";

class LeaveProject extends Component {
  state = {};

  leaveproject = () => {
    const project = this.props.project;
    console.log(project);
    let final_team = [];
    let final_tasks = [];
    let tasks = project.tasks;
    tasks.forEach((task) => {
      let final_task = task;
      let taskmembs = task.assignedTo;
      let f_taskmembs = [];
      taskmembs.forEach((memb) => {
        if (memb === getCurrentUser()._id) f_taskmembs.push(project.leader);
        else f_taskmembs.push(memb);
      });
      f_taskmembs = [...new Set(f_taskmembs)];
      final_task.assignedTo = f_taskmembs;
      console.log(final_task);
      final_tasks.push(final_task);
    });
    console.log(final_tasks);

    let membs = this.props.project.team;
    membs.forEach((user) => {
      if (user !== getCurrentUser()._id) final_team.push(user);
      console.log(final_team);
    });

    let proj = {
      title: project.title,
      description: project.description,
      skills: project.skills,
      roles: project.skills,
      team: final_team,
      tasks: final_tasks,
    };
    updateProject(proj, project._id).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        alert("You left this project");
        window.location.reload(false);
      }
    });
  };

  leaveConfirmed = () => {
    let answer = window.confirm("Are you sure you want to leave this project?");
    if (answer) {
      this.leaveproject();
    }
  };

  render() {
    return (
      <div>
        <Button onClick={this.leaveConfirmed} variant="outline-danger">
          Leave Project
        </Button>
      </div>
    );
  }
}

export default LeaveProject;
