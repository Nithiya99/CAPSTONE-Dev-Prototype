import React, { Component } from "react";
import { connect } from "react-redux";
import { getNotifications } from "../apiNotifications";
import {
  notificationAdded,
  getNotified,
  clearNotifications,
  setSegregatedNotifications,
} from "../store/notifications";
import * as _ from "lodash";
import { getCurrentUser } from "../user/apiUser";
import ProjectRecommendation from "./ProjectRecommendation";
import { getProject } from "../project/apiProject";
import { listmyprojects } from "./../project/apiProject";
import { Modal, Button } from "react-bootstrap";
import RatingComponent from "../project/RatingComponent";
class Home extends Component {
  state = {
    notificationGroupedObject: {},
    show: false,
  };
  componentDidMount() {
    listmyprojects().then((projects) =>
      this.setState({ projects: projects.userProjects })
    );
  }
  getProjectTeamFromState = (projectId) => {
    return this.state.projects.map((project) => {
      if (project._id.toString() === projectId.toString()) {
        return project.team;
      }
    });
    // return undefined;
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  render() {
    if (getCurrentUser()._id === undefined) return;
    const { notifications } = this.props;
    const { notificationGroupedObject, projects } = this.state;
    // if (this.props.notifications.length > 0) {
    //   console.log("NOTIFICATIONS:");
    //   console.log(this.props.notifications);
    // }
    // notifications.map((notif) => {
    //   console.log(notif);
    // });

    Object.keys(notificationGroupedObject).length > 0 &&
      console.log(Object.keys(notificationGroupedObject));
    // console.log(projects);
    if (
      Object.keys(notificationGroupedObject).length !== 0 &&
      projects !== undefined &&
      notificationGroupedObject.FeedbackForm !== undefined
    ) {
      if (notificationGroupedObject["FeedbackForm"].length > 0) {
        console.log("Feedback Forms:");
        console.log(notificationGroupedObject.FeedbackForm);
      }
    }
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
