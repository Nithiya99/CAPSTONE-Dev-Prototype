import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProject } from "../project/apiProject";
import { Button } from "react-bootstrap";
const BASE_URL = process.env.REACT_APP_API_URL;
class Notifications extends Component {
  state = {
    selected: "home",
  };
  componentDidMount() {
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
export default connect(mapStateToProps, null)(Notifications);
