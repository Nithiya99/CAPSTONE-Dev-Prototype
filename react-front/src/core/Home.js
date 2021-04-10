import React, { Component } from "react";
import { connect } from "react-redux";
import { notificationAdded, getNotified } from "../store/notifications";
import { getNotifications } from "../apiNotifications";
import { getCurrentUser } from "../user/apiUser";
import ProjectRecommendation from "./ProjectRecommendation";
class Home extends Component {
  state = {};
  componentDidMount() {
    getNotifications()
      .then((response) => {
        return response.json();
      })
      .then((val) => {
        let notifications = val.notifications;
        notifications.map((notif) => {
          this.props.getNotified({
            id: notif._id,
            message: notif.message,
            read: notif.read,
            type: notif.notifType,
          });
        });
      });
  }
  render() {
    if (getCurrentUser()._id === undefined) return;
    if (this.props.notifications.length > 0)
      console.log(this.props.notifications);

    return (
      <>
        <div className="jumbotron">
          <h2>Home</h2>
          <p className="lead">News Feed (Posts) will be here</p>
        </div>
        <ProjectRecommendation />
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  notifications: state.notifications.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (params) => dispatch(notificationAdded(params)),
  getNotified: (params) => dispatch(getNotified(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
