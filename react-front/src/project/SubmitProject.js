import React, { Component } from "react";
import { isAuthenticated } from "./../auth/index";
import { Redirect } from "react-router-dom";
import { finish } from "./apiProject";
import { withStyles } from "@material-ui/core/styles";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import PublishTwoToneIcon from "@material-ui/icons/PublishTwoTone";
import socketio from "./../utils/Socket";
import { getUserById, setRating } from "../user/apiUser";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FavoriteIcon from "@material-ui/icons/Favorite";
import RatingComponent from "./Rating/RatingComponent";
const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

class SubmitProject extends Component {
  state = {
    show: false,
    rating: {},
  };

  submitproject = () => {
    const token = isAuthenticated().token;
    const { projectId, projectTeam } = this.props;
    // console.log(projectId);
    socketio.emit("getOnlineUsers");
    socketio.on("onlineUsers", (data) => {
      console.log("Online Users:", Object.values(data.users));
      const arrUsers = Object.values(data.users);
      console.log("team:", projectTeam);

      projectTeam.map((member) => {
        if (arrUsers.includes(member)) {
          console.log("Member " + member + " Is ONLINE!");
          this.setState({ show: true });
        }
      });
    });
    // finish(projectId, token).then((data) => {
    //   if (data.error) {
    //     console.log(data.error);
    //   } else {
    //     alert("Project marked as completed");
    //     window.location.reload();
    //   }
    // });
  };

  submitConfirmed = () => {
    let answer = window.confirm(
      "Are you sure you want to submit this project? (Note : If submitted, project cannot be modified)"
    );
    if (answer) {
      this.submitproject();
    }
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  componentDidMount() {
    const { projectTeam } = this.props;
    let team = [];
    projectTeam.map((member, index) => {
      getUserById(member).then((val) => {
        let rating = this.state.rating;
        rating[val.user._id] = 4;
        this.setState({ rating });
        team.push(val.user);
        this.setState({ team });
        // setRating(val.user._id, rating[val.user._id]).then((val) =>
        //   console.log(val)
        // );
      });
      // console.log(user);
    });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }

    const { show, team, rating } = this.state;
    if (team === undefined) return null;
    return (
      <>
        {show ? (
          <Modal
            show={show}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Lets Give your amazing team some Feedback!
              </Modal.Title>
            </Modal.Header>
            <Modal.Body scrollable="true">
              <RatingComponent rating={rating} team={team} />
            </Modal.Body>
          </Modal>
        ) : (
          <></>
        )}
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
      </>
    );
  }
}

export default SubmitProject;
