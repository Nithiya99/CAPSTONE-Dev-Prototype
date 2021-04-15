import React, { Component } from "react";
import { connect } from "react-redux";
import { getNotifications } from "../apiNotifications";
import {
  notificationAdded,
  getNotified,
  clearNotifications,
} from "../store/notifications";
import { getCurrentUser } from "../user/apiUser";
import ProjectRecommendation from "./ProjectRecommendation";
class Home extends Component {
  state = {};

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
