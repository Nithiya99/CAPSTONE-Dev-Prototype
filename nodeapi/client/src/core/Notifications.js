import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProject } from "../project/apiProject";
import { Button } from "react-bootstrap";
import { getNotifications } from "../apiNotifications";
import ReqIcon from "../images/request.png";
import NewAddIcon from "../images/working.png";
import AcceptIcon from "../images/accepted.png";
import DeclineIcon from "../images/remove.png";
import LiveClock from "react-live-clock";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";
import * as _ from "lodash";
import {
  getNotified,
  clearNotifications,
  setSegregatedNotifications,
  notificationAdded,
  setNotifications,
} from "../store/notifications";
import FeedbackForm from "./../project/FeedbackForm";
import { getCurrentUser } from "../user/apiUser";
import { acceptRequest, declineRequest } from "./../project/apiProject";
import { toast, ToastContainer } from "react-toastify";
import { removeAndUpdateNotifications } from "./../store/notifications";
import { removeNotificationId } from "./../apiNotifications";
const BASE_URL = process.env.REACT_APP_API_URL;
class Notifications extends Component {
  state = {
    selected: "home",
  };
  componentDidMount() {
    this.props.clearNotifications();
    getNotifications()
      .then((response) => {
        return response.json();
      })
      .then((val) => {
        let notifications = val.notifications;
        console.log("Notifications:", notifications);
        notifications.map((notif) => {
          this.props.getNotified({
            type: notif.notifType,
            id: notif._id,
            message: notif.message,
            read: notif.read,
            projectId: notif.projectId ? notif.projectId : "none",
          });
        });

        let notificationGroupedObject = _.groupBy(notifications, "notifType");
        console.log("Group Object:", notificationGroupedObject);
        this.setState({ notificationGroupedObject });
        this.props.setSegregatedNotifications({
          segregatedNotifications: notificationGroupedObject,
        });
        // console.log(notifications);
      });
    // const { segregatedNotifications } = this.props;
    // console.log(segregatedNotifications);
  }
  getTo(val) {
    return getProject(val.projectId).then((data) => {
      let obj = {
        pathname: "/myprojects/dashboard/" + val.projectId,
        state: { project: data.project },
      };
      // console.log(obj);
      return obj;
    });
  }
  render() {
    let { notifications, segregatedNotifications } = this.props;
    // if (this.props.notifications.length > 0)
    // console.log(this.props.notifications);
    // console.log(segregatedNotifications);
    // if (notifications.length === 0) {
    //   return <>No Notifsss</>;
    // }
    let { selected } = this.state;
    console.log(segregatedNotifications);

    return (
      <>
        <ToastContainer />
        <div
          className="subheader py-2 py-lg-6  subheader-transparent "
          id="kt_subheader"
        >
          <div className=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <div className="d-flex align-items-center flex-wrap mr-2">
              <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">
                Notifications
              </h5>
              <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
            </div>
            <div class="d-flex align-items-center flex-wrap">
              <Badge variant="primary">
                <div className="d-flex align-items-center flex-wrap mr-2">
                  <h6>{dayjs().format("DD MMMM, dddd")}</h6>
                  <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 ml-4 bg-gray-200"></div>
                  <h6>
                    <LiveClock format="hh:mm a" ticking />
                  </h6>
                </div>
              </Badge>
            </div>
          </div>
        </div>
        {Object.keys(segregatedNotifications).map((type) => (
          <div className="container mt-5">
            {segregatedNotifications[type].map((val) => {
              // console.log(newObj);
              if (val.notifType === "RequestForRole") {
                return (
                  <>
                    <div
                      className="alert alert-custom alert-notice alert-light-dark"
                      role="alert"
                    >
                      <div className="alert-icon">
                        <img
                          src={ReqIcon}
                          alt="Logo"
                          style={{ height: "40px" }}
                        />
                      </div>
                      <div className="alert-text">
                        <Link
                          className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder"
                          to={{
                            pathname: "/myprojects",
                          }}
                          // {
                          //   pathname: `/myprojects/dashboard/${project._id}`,
                          //   state: { project: project },
                          // }
                        >
                          {val.message}
                        </Link>
                      </div>
                    </div>
                    {/* <Link
                      to={{
                        pathname: "/myprojects",
                      }}
                      // {
                      //   pathname: `/myprojects/dashboard/${project._id}`,
                      //   state: { project: project },
                      // }
                    >
                      <div
                        className="card-text ml-3 mt-1 mb-2 p-1"
                        style={{ width: "50rem" }}
                      >
                        {val.message}
                      </div>
                    </Link> */}
                  </>
                );
              }
              if (val.notifType === "RoleDeclined") {
                return (
                  <>
                    <div
                      className="alert alert-custom alert-notice alert-light-danger"
                      role="alert"
                    >
                      <div className="alert-icon">
                        <img
                          src={DeclineIcon}
                          alt="Icon"
                          style={{ height: "40px" }}
                        />
                      </div>
                      <div className="alert-text">
                        <Link
                          className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder"
                          to={{
                            pathname: "/joinproject",
                          }}
                          // {
                          //   pathname: `/myprojects/dashboard/${project._id}`,
                          //   state: { project: project },
                          // }
                        >
                          {val.message}
                        </Link>
                      </div>
                    </div>
                    {/* <Link
                      to={{
                        pathname: "/joinproject",
                      }}
                      // {
                      //   pathname: `/myprojects/dashboard/${project._id}`,
                      //   state: { project: project },
                      // }
                    > 
                      <div
                        className="card-text ml-3 mt-1 mb-2 p-1"
                        style={{ width: "50rem" }}
                      >
                        {val.message}
                      </div>
                    </Link>*/}
                  </>
                );
              }
              if (val.notifType === "RoleAccepted") {
                return (
                  <>
                    <div
                      className="alert alert-custom alert-notice alert-light-success"
                      role="alert"
                    >
                      <div className="alert-icon">
                        <img
                          src={AcceptIcon}
                          alt="Icon"
                          style={{ height: "40px" }}
                        />
                      </div>
                      <div className="alert-text">
                        <Link
                          className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder"
                          onClick={async () => {
                            let obj = {};
                            obj = await this.getTo(val);
                            // console.log(obj);
                            this.props.history.push(obj);
                          }}
                          // {
                          //   pathname: `/myprojects/dashboard/${project._id}`,
                          //   state: { project: project },
                          // }
                        >
                          {val.message}
                        </Link>
                      </div>
                    </div>
                    {/* <Link
                      onClick={async () => {
                        let obj = {};
                        obj = await this.getTo(val);
                        // console.log(obj);
                        this.props.history.push(obj);
                      }}
                      // {
                      //   pathname: `/myprojects/dashboard/${project._id}`,
                      //   state: { project: project },
                      // }
                    >
                      <div
                        className="card-text ml-3 mt-1 mb-2 p-1"
                        style={{ width: "50rem" }}
                      >
                        {val.message}
                      </div>
                    </Link> */}
                  </>
                );
              }
              if (val.notifType === "NewMember") {
                return (
                  <>
                    <div
                      className="alert alert-custom alert-notice alert-light-warning"
                      role="alert"
                    >
                      <div className="alert-icon">
                        <img
                          src={NewAddIcon}
                          alt="Logo"
                          style={{ height: "40px" }}
                        />
                      </div>
                      <div className="alert-text">
                        <Link
                          className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder"
                          onClick={async () => {
                            let obj = {};
                            obj = await this.getTo(val);
                            // console.log(obj);
                            this.props.history.push(obj);
                          }}
                          // {
                          //   pathname: `/myprojects/dashboard/${project._id}`,
                          //   state: { project: project },
                          // }
                        >
                          {val.message}
                        </Link>
                      </div>
                    </div>
                    {/* <Link
                      onClick={async () => {
                        let obj = {};
                        obj = await this.getTo(val);
                        // console.log(obj);
                        this.props.history.push(obj);
                      }}
                      // {
                      //   pathname: `/myprojects/dashboard/${project._id}`,
                      //   state: { project: project },
                      // }
                    >
                      <div
                        className="card-text ml-3 mt-1 mb-2 p-1"
                        style={{ width: "50rem" }}
                      >
                        {val.message}
                      </div>
                    </Link> */}
                  </>
                );
              }
              if (val.notifType === "FeedbackForm") {
                // console.log("FeedbackForm:", val);
                return (
                  <>
                    <FeedbackForm
                      type={val.notifType}
                      id={val._id}
                      message={val.message}
                      projectId={val.projectId}
                    />
                  </>
                );
              }
              if (val.notifType === "InviteToProject") {
                // console.log("FeedbackForm:", val);
                return (
                  <>
                    <>
                      {" "}
                      <div
                        className="alert alert-custom alert-notice alert-light-warning"
                        role="alert"
                      >
                        <div className="alert-icon">
                          <img
                            src={NewAddIcon}
                            alt="Logo"
                            style={{ height: "40px" }}
                          />
                        </div>
                        <div className="alert-text">
                          <Link
                            className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder"
                            to={`/joinproject`}
                            // {
                            //   pathname: `/myprojects/dashboard/${project._id}`,
                            //   state: { project: project },
                            // }
                          >
                            {val.message}
                          </Link>
                        </div>
                      </div>
                    </>
                  </>
                );
              }
              if (
                val.notifType === "StartedFollowing" ||
                val.notifType === "FollowedYou"
              ) {
                // console.log("StartedFollowing:", val);
                // console.log("Current user id: ", getCurrentUser()._id);
                return (
                  <>
                    {" "}
                    <div
                      className="alert alert-custom alert-notice alert-light-warning"
                      role="alert"
                    >
                      <div className="alert-icon">
                        <img
                          src={NewAddIcon}
                          alt="Logo"
                          style={{ height: "40px" }}
                        />
                      </div>
                      <div className="alert-text">
                        <Link
                          className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder"
                          to={`/user/${val.userObjId}`}
                          // {
                          //   pathname: `/myprojects/dashboard/${project._id}`,
                          //   state: { project: project },
                          // }
                        >
                          {val.message}
                        </Link>
                      </div>
                    </div>
                  </>
                );
              }
              if (val.notifType === "InviteToRole") {
                // console.log("StartedFollowing:", val);
                // console.log("Current user id: ", getCurrentUser()._id);
                console.log(val);
                return (
                  <>
                    <>
                      {" "}
                      <div
                        className="alert alert-custom alert-notice alert-light-warning"
                        role="alert"
                      >
                        <div className="alert-icon">
                          <img
                            src={NewAddIcon}
                            alt="Logo"
                            style={{ height: "40px" }}
                          />
                        </div>
                        <div className="alert-text">
                          <Link
                            className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder"
                            to={`/joinproject`}
                            // {
                            //   pathname: `/myprojects/dashboard/${project._id}`,
                            //   state: { project: project },
                            // }
                          >
                            {val.message}
                          </Link>
                          <Button
                            onClick={() => {
                              // console.log(
                              //   val.sentBy,
                              //   val.projectId,
                              //   val.sentTo,
                              //   val.roleId
                              // );
                              acceptRequest(
                                val.sentBy,
                                val.projectId,
                                val.sentTo,
                                val.roleId
                              )
                                .then((res) => {
                                  console.log(res);
                                  this.props.notificationAdded({
                                    userId: val.sentBy,
                                    message: `New Role (${
                                      res.role.roleName
                                    }) Accepted by ${
                                      getCurrentUser().name
                                    }, Congrats on the new Member!`,
                                    type: "RoleAcceptedInNotif",
                                    projectId: val.projectId,
                                  });
                                  this.props.notificationAdded({
                                    userId: getCurrentUser()._id,
                                    message: `New Role (${res.role.roleName})! time to show off my skills B)`,
                                    type: "RoleAcceptedInNotif",
                                    projectId: val.projectId,
                                  });
                                })
                                .then(() => {
                                  removeNotificationId(
                                    getCurrentUser()._id,
                                    val._id
                                  ).then((data) => {
                                    if (data.user !== undefined) {
                                      console.log("removed notif");
                                      window.location.reload();
                                    }
                                  });
                                });
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => {
                              //  declineRequest(
                              //     getCurrentUser()._id,
                              //     projectId,
                              //     user._id,
                              //     roleId
                              //   ).then((res) => {
                              //     console.log(res);
                              //     this.props.notificationAdded({
                              //       userId: user._id,
                              //       message: `Role Declined by ${getCurrentUser().name} :(`,
                              //       type: "RoleDeclined",
                              //       projectId: projectId,
                              //     });
                              //   });
                              // }}
                              declineRequest(
                                val.sentBy,
                                val.projectId,
                                val.sentTo,
                                val.roleId
                              )
                                .then((res) => {
                                  console.log(res);
                                  this.props.notificationAdded({
                                    userId: val.sentBy,
                                    message: `Role (${
                                      res.role.roleName
                                    }) declined by ${getCurrentUser().name}`,
                                    type: "RoleDeclinedInNotif",
                                    projectId: val.projectId,
                                  });
                                  toast.warning(
                                    `Rejected role (${res.role.roleName}) successfully!`
                                  );
                                  // this.props.removeAndUpdateNotifications({
                                  //   userId: getCurrentUser()._id,
                                  //   notifId: val._id,
                                  // });
                                })
                                .then(() => {
                                  removeNotificationId(
                                    getCurrentUser()._id,
                                    val._id
                                  ).then((data) => {
                                    if (data.user !== undefined) {
                                      console.log("removed notif");
                                      window.location.reload();
                                    }
                                  });
                                });
                            }}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </>
                  </>
                );
              }

              return (
                <div
                  className="card-text ml-3 mt-1 mb-2 p-1"
                  style={{ width: "50rem" }}
                >
                  {val.message}
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  notifications: state.notifications.notifications,
  segregatedNotifications: state.notifications.segregatedNotifications,
});
const mapDispatchToProps = (dispatch) => ({
  getNotified: (params) => dispatch(getNotified(params)),
  clearNotifications: () => dispatch(clearNotifications()),
  setSegregatedNotifications: (params) =>
    dispatch(setSegregatedNotifications(params)),
  notificationAdded: (params) => dispatch(notificationAdded(params)),
  setNotifications: (params) => dispatch(setNotifications(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
