import React, { Component } from "react";
import { isAuthenticated } from "./../auth/index";
import { Redirect } from "react-router-dom";
import { finish } from "./apiProject";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import PublishTwoToneIcon from "@material-ui/icons/PublishTwoTone";

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
        <OverlayTrigger
          key="top"
          placement="top"
          overlay={<Tooltip id="top">Finalize Project</Tooltip>}
        >
          <Button
            onClick={this.submitConfirmed}
            className="ml-2"
            variant="success"
          >
            <PublishTwoToneIcon />
          </Button>
        </OverlayTrigger>
      </div>
    );
  }
}

export default SubmitProject;
