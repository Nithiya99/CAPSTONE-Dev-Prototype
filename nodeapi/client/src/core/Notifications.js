import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProject } from "../project/apiProject";
import { Button } from "react-bootstrap";
import { getNotifications } from "../apiNotifications";
import * as _ from "lodash";
import {
  getNotified,
  clearNotifications,
  setSegregatedNotifications,
} from "../store/notifications";
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
        console.log(notifications);
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
        {Object.keys(segregatedNotifications).map((type) => (
          <div className="card mt-2 p-1">
            <h4 className="card-title m-3">{type}:</h4>
            {segregatedNotifications[type].map((val) => {
              // console.log(newObj);
              if (val.notifType === "RequestForRole") {
                return (
                  <>
                    <Link
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
                    </Link>
                  </>
                );
              }
              if (val.notifType === "RoleDeclined") {
                return (
                  <>
                    <Link
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
                    </Link>
                  </>
                );
              }
              if (val.notifType === "RoleAccepted") {
                return (
                  <>
                    <Link
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
                    </Link>
                  </>
                );
              }
              if (val.notifType === "NewMember") {
                return (
                  <>
                    <Link
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
                    </Link>
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
