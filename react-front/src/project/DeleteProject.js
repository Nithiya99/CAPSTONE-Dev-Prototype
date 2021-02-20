import React, { Component } from "react";
import { isAuthenticated } from "./../auth/index";
import { signout } from "../auth";
import { Redirect } from "react-router-dom";
import { abandon } from "./apiProject";
import { Button } from "react-bootstrap";

class DeleteProject extends Component {
  state = {};

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const { projectId } = this.props;
    abandon(projectId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        alert("Project is deleted");
        // // redirect
        // this.setState({ redirect: true });
        window.location.reload();
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Button onClick={this.deleteConfirmed} variant="outline-danger">
          Abandon Project
        </Button>
      </div>
    );
  }
}

export default DeleteProject;
