import React, { Component } from "react";
import ShareIcon from "@material-ui/icons/Share";
import { ToastContainer, toast } from "react-toastify";
import Heart from "react-animated-heart";
import { getCurrentUser } from "./../user/apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";
import {
  likepost,
  dislikepost,
  addcomment,
  getpost,
  deleteComment,
  reportpost,
} from "./apiPosts";
import { collect } from "collect.js";
import CommentIcon from "@material-ui/icons/Comment";
import moment from "moment";
import { Accordion, Button, Card, Modal, ModalBody } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { isAuthenticated } from "../auth";
import { Carousel } from "react-bootstrap";
import ReactPlayer from "react-player";
import YouTubeIcon from "@material-ui/icons/YouTube";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import "bootstrap/dist/css/bootstrap.css";
import Sentiment from "sentiment";
import Dropdown from "react-bootstrap/Dropdown";

const sentiment = new Sentiment();

class showPost extends Component {
  state = {
    isClick: false,
    comment: "",
    id: String,
    post: {},
    loggedin: false,
    post_id: String,
    sentimentScore: null,
    show: false,
  };

  componentDidMount() {
    let post_id = this.props.match.params.postId;
    getpost(post_id).then((data) => {
      this.setState({
        post: data,
        post_id: post_id,
      });
      if (isAuthenticated()) {
        this.setState({ loggedin: true, id: getCurrentUser()._id });
        let users = [...this.state.post.post.liked_by];
        if (users !== undefined && users !== null && users !== [])
          if (users.indexOf(getCurrentUser()._id) > -1)
            this.setState({ isClick: true });
      }
    });
  }

  handleSubmitClicked = () => {
    reportpost(this.props._id);
    this.setState({
      show: false,
      isDisabled: true,
    });
  };
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  postliked = () => {
    if (this.state.loggedin) {
      this.setState({ isClick: !this.state.isClick });
      if (this.state.isClick)
        dislikepost(this.state.post_id).then((data) => console.log(data));
      else likepost(this.state.post_id).then((data) => console.log(data));
    } else return toast.error("Please login-In");
  };

  onTextChange = (e) => {
    this.setState({ comment: e.target.value });
    this.findSentiment(e.target.value);
  };

  submitcomment = () => {
    if (this.state.loggedin) {
      addcomment(this.state.post_id, this.state.comment).then((data) =>
        console.log(data)
      );
    } else return toast.error("Please login-In ");
  };

  findSentiment(comment) {
    const result = sentiment.analyze(comment);
    this.setState({
      sentimentScore: result.score,
    });
  }

  deletecomment(e, commentId) {
    e.preventDefault();
    // console.log(this.state.post.post._id, commentId);
    deleteComment(commentId, this.state.post.post._id).then((data) =>
      console.log(data)
    );
  }

  rendercomments = (comments) => {
    let reverseComments = [...comments].reverse();
    return reverseComments.map(
      ({ PostedOn, comment, userName, _id, userId }, index) => (
        <div className="d-flex py-5">
          <div className="symbol symbol-40 symbol-light-warning mr-5">
            <span className="symbol-label">
              <img src={DefaultProfile} className="h-75 align-self-end" />
            </span>
          </div>
          <div className="d-flex flex-column flex-row-fluid">
            <div className="d-flex align-items-center flex-wrap">
              <Link
                to="#"
                className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder pr-6"
              >
                {userName}
              </Link>
              <span className="text-muted font-weight-normal flex-grow-1 font-size-sm">
                {moment(PostedOn).format("DD-MM-YYYY h:mm a")}
              </span>
            </div>
            <span className="text-dark-75 font-size-sm font-weight-normal pt-1">
              {comment}
            </span>
          </div>
          {this.state.id === userId && (
            <button
              className="btn btn-danger"
              onClick={(e) => this.deletecomment(e, _id)}
            >
              <DeleteTwoToneIcon />
            </button>
          )}
        </div>
      )
    );
  };

  render() {
    let post = this.state.post.post;
    const current_post = { ...post };
    let type = current_post.postType;
    const posted_by = { ...current_post.postedBy };
    let counts = collect(current_post.liked_by).count();
    let imageUrl = [];
    if (current_post === undefined) return null;
    if (current_post.photo !== undefined)
      current_post.photo.map((url) => {
        imageUrl.push(url);
      });
    return (
      <>
        <ToastContainer />
        <div className="card card-custom gutter-b mt-5">
          <div className="card-body">
            <div className="d-flex align-items-center pb-4">
              <div className="symbol symbol-40 symbol-light-warning mr-5">
                <span className="symbol-label">
                  <img src={DefaultProfile} className="h-75 align-self-end" />
                </span>
              </div>
              <div className="d-flex flex-column flex-grow-1">
                <Link
                  to="#"
                  className="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bolder"
                >
                  {posted_by.name}
                </Link>
                <span className="text-muted font-weight-bold">
                  {moment(current_post.created).format("DD-MM-YYYY h:mm a")}
                </span>
              </div>
            </div>
            <div>
              {(type === "image" &&
                (imageUrl !== "undefined" && imageUrl.length > 1 ? (
                  <Carousel interval={null}>
                    {imageUrl.map((url, i) => {
                      return (
                        <Carousel.Item>
                          <img
                            className="d-block w-100"
                            style={{
                              width: "45vw",
                              height: "30vw",
                              "object-fit": "cover",
                            }}
                            src={url}
                            alt={url}
                          />
                        </Carousel.Item>
                      );
                    })}
                  </Carousel>
                ) : (
                  <Card.Img
                    style={{
                      width: "45vw",
                      height: "30vw",
                      "object-fit": "cover",
                    }}
                    variant="top"
                    src={imageUrl[0]}
                  />
                ))) ||
                (type === "video" && (
                  <ReactPlayer
                    url={current_post.video}
                    controls={true}
                    volume={1}
                    muted={false}
                  />
                )) ||
                (type === "text" && current_post.title) ||
                (type === "youtubeVideo" && (
                  <>
                    <YouTubeIcon />
                    <div>{current_post.metadataTitle}</div>
                    <center>
                      <ReactPlayer
                        url={current_post.video}
                        controls={true}
                        width={window.width}
                      />
                    </center>
                    <div>By {current_post.metadataAuthor}</div>
                  </>
                ))}
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-primary"
                  disabled={this.state.isDisabled}
                  onClick={this.handleShow.bind(this)}
                >
                  Report
                </button>
                <Modal
                  show={this.state.show}
                  onHide={this.handleClose.bind(this)}
                >
                  <Modal.Header>
                    <Modal.Title>Are you Sure to report this post?</Modal.Title>
                    <Button onClick={this.handleClose.bind(this)}>x</Button>
                  </Modal.Header>
                  <ModalBody>
                    <Button
                      disabled={this.state.isDisabled}
                      onClick={this.handleSubmitClicked}
                    >
                      Yes
                    </Button>
                  </ModalBody>
                </Modal>
                <button
                  onClick={() => {
                    getpost(current_post._id).then((data) => {
                      let link = `http://localhost:3000/post/${data.post._id}`;
                      navigator.clipboard.writeText(link);
                      toast.success("Link copied to clipboard");
                    });
                  }}
                >
                  <ShareIcon />
                </button>
                <Heart isClick={this.state.isClick} onClick={this.postliked} />
                {counts + " likes"}
              </div>
              <TextField
                name="comment"
                onChange={(e) => this.onTextChange(e)}
                id="standard-basic"
                label="Add a Comment"
                fullWidth
              />
              <button
                onClick={this.submitcomment}
                className="btn btn-raised btn-primary mx-auto mt-3 mb-2 col-sm-3"
                disabled={this.state.sentimentScore < -3 ? true : false}
              >
                Submit
              </button>
              {collect(current_post.comments).count() > 0 ? (
                this.rendercomments(current_post.comments)
              ) : (
                <p>No Comments</p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default showPost;
