import React, { Component } from "react";
import { getUserById } from "../user/apiUser";
import { Button } from "react-bootstrap";
import { acceptRequest, declineRequest } from "./apiProject";
import { getCurrentUser } from "./../user/apiUser";
class Requests extends Component {
  state = {};
  componentDidMount() {
    const { reqId } = this.props;
    getUserById(reqId).then((res) => {
      this.setState({ user: res.user });
    });
  }
  render() {
    const { user } = this.state;
    const { projectId, roleId } = this.props;
    if (user === undefined) return null;
    const url = "http://localhost:3000/user/" + user._id.toString();
    return (
      <>
        <div className="row">
          <div className="ml-2 mt-2">
            {user.name}
            <small className="text-mute">(@{user.username})</small>
          </div>
          {/* <div className="ml-2">
            <Button
              onClick={() => {
                console.log(url);
              }}
            >
              View Profile
            </Button>
          </div> */}
          <div className="ml-1">
            <Button
              onClick={() => {
                acceptRequest(
                  getCurrentUser()._id,
                  projectId,
                  user._id,
                  roleId
                ).then((res) => {
                  console.log(res);
                });
              }}
            >
              Accept
            </Button>
          </div>
          <div className="ml-1">
            <Button
              onClick={() => {
                declineRequest(
                  getCurrentUser()._id,
                  projectId,
                  user._id,
                  roleId
                ).then((res) => {
                  console.log(res);
                });
              }}
            >
              Decline
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default Requests;
