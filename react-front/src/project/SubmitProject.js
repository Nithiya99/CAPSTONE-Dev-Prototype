import React, { Component } from "react";
import { isAuthenticated } from "./../auth/index";
import { Redirect } from "react-router-dom";
import { Button } from "react-bootstrap";
import { finish } from "./apiProject";

class SubmitProject extends Component {
  state = {};

  submitproject = () => {
    const token = isAuthenticated().token;
    const { projectId } = this.props;
    // console.log(projectId);
    finish(projectId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        alert("Project marked as completed");
        window.location.reload();
      }
    });
  };

  submitConfirmed = () => {
    let answer = window.confirm(
      "Are you sure you want to submit this project? (Note : If submitted, project cannot be modified)"
    );
    if (answer) {
      this.submitproject();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Button onClick={this.submitConfirmed} variant="outline-success">
          Submit Project
        </Button>
      </div>
    );
  }
}

export default SubmitProject;
