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
import PostImage from "./../posts/PostImage";
import PostVideo from "./../posts/PostVideo";
import { getAllPosts } from "./../posts/apiPosts";
import Post from "../posts/Post";
import LiveClock from "react-live-clock";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import VideoPost from "./../posts/VideoPost";

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
        console.log(data);
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
        <div
          className="subheader py-2 py-lg-6  subheader-transparent "
          id="kt_subheader"
        >
          <div className=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <div className="d-flex align-items-center flex-wrap mr-2">
              <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">
                My Feed
              </h5>
              <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
              <span>
                <div
                  className="quick-search quick-search-inline ml-4 w-250px"
                  id="kt_quick_search_inline"
                >
                  <form className="quick-search-form">
                    <div className="input-group rounded">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <SearchTwoToneIcon />
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control h-40px"
                        placeholder="Search..."
                      />
                    </div>
                  </form>
                </div>
              </span>
            </div>
            <div className="d-flex align-items-center flex-wrap">
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
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="jumbotron w-100">
                <h2>Home</h2>
                <p className="lead">News Feed (Posts) will be here</p>
              </div>
              <div className="card p-2">
                <div className="card-body">
                  <PostImage />
                  <PostVideo />
                </div>
                {posts.map((post) => {
                  if (post.postType === "video")
                    return (
                      <VideoPost
                        headerText={post.title}
                        footerText={"by " + post.postedBy.name}
                        cardText={post.video}
                        videoUrl={post.video}
                        liked_by={post.liked_by}
                        _id={post._id}
                        comments={post.comments}
                        tags={post.tags}
                      />
                    );
                  if (post.postType === "image")
                    return (
                      <Post
                        headerText={post.title}
                        footerText={"by " + post.postedBy.name}
                        cardText={post.photo}
                        imageUrl={post.photo}
                        liked_by={post.liked_by}
                        _id={post._id}
                        comments={post.comments}
                        tags={post.tags}
                      />
                    );
                })}
                <ProjectRecommendation />
              </div>
            </div>
          </div>
        </div>
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
