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
import PostImage from "./../posts/PostImage";
import { getAllPosts } from "./../posts/apiPosts";
import Post from "../posts/Post";
class Home extends Component {
  state = {
    notificationGroupedObject: {},
    show: false,
  };
  componentDidMount() {
    listmyprojects().then((projects) =>
      this.setState({ projects: projects.userProjects })
    );
    getAllPosts()
      .then((res) => res.json())
      .then((data) => {
        this.setState({ posts: data.posts });
      });
  }
  getProjectTeamFromState = (projectId) => {
    return this.state.projects.map((project) => {
      if (project._id.toString() === projectId.toString()) {
        return project.team;
      }
    });
    // return undefined;
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
    const { posts } = this.state;
    if (posts === undefined) return null;
    return (
      <>
        <div className="jumbotron">
          <h2>Home</h2>
          <p className="lead">News Feed (Posts) will be here</p>
        </div>
        <div className="card p-2">
          <div className="card-body">
            <PostImage />
          </div>
        </div>
        {posts.map((post) => (
          <Post
            headerText={" Blehhhhh "}
            footerText={"by " + post.postedBy.name}
            cardText={post.photo}
            imageUrl={post.photo}
          />
        ))}
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
