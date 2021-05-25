import React, { Component } from "react";
import ShareIcon from "@material-ui/icons/Share";
import { ToastContainer, toast } from "react-toastify";
import Heart from "react-animated-heart";
import { getCurrentUser } from "./../user/apiUser";
import {
  likepost,
  dislikepost,
  addcomment,
  getpost,
  reportpost,
} from "./apiPosts";
import { collect } from "collect.js";
import CommentIcon from "@material-ui/icons/Comment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ReportTwoToneIcon from "@material-ui/icons/ReportTwoTone";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import moment from "moment";
import {
  Accordion,
  Button,
  Card,
  Modal,
  ModalBody,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import Sentiment from "sentiment";
import DeletePost from "./DeletePost";
import { changePosts } from "../store/posts";
import { connect } from "react-redux";
import DefaultProfile from "../images/avatar.png";
const sentiment = new Sentiment();

class TextPostView extends Component {
  state = {
    isClick: false,
    comment: "",
    id: getCurrentUser()._id,
    sentimentScore: null,
    show: false,
  };

  componentDidMount() {
    let users = this.props.liked_by;
    if (users !== undefined && users !== null && users !== [])
      if (users.indexOf(getCurrentUser()._id) > -1)
        this.setState({ isClick: true });
  }

  postliked = () => {
    this.setState({ isClick: !this.state.isClick });
    if (this.state.isClick)
      dislikepost(this.props._id)
        .then((data) => console.log(data))
        .then(() => this.props.changePosts(this.props._id));
    else {
      likepost(this.props._id)
        .then((data) => console.log(data))
        .then(() => this.props.changePosts(this.props._id));
    }
  };
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

  onTextChange = (e) => {
    this.setState({ comment: e.target.value });
    this.findSentiment(e.target.value);
  };

  submitcomment = () => {
    addcomment(this.props._id, this.state.comment).then(async () => {
      await this.props.changePosts(this.props._id);
    });
  };

  findSentiment(comment) {
    const result = sentiment.analyze(comment);
    this.setState({
      sentimentScore: result.score,
    });
  }

  rendercomments = (comments) => {
    let reverseComments = [...comments].reverse();
    return reverseComments.map(({ PostedOn, comment, userName }, index) => (
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
      </div>
    ));
  };

  render() {
    const {
      footerText,
      text,
      liked_by,
      _id,
      tags,
      comments,
      delete_button,
      created,
    } = this.props;
    let counts = collect(liked_by).count();
    return (
      <>
        <ToastContainer />
        <div className="card card-custom gutter-b">
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
                  {footerText}
                </Link>
                <span className="text-muted font-weight-bold">
                  {moment(created).format("DD-MM-YYYY h:mm a")}
                </span>
              </div>
              <div className="ml-auto">
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={
                    <Popover id="popover-basic">
                      <Popover.Content>
                        <div>
                          <button
                            className="btn btn-clean"
                            disabled={this.state.isDisabled}
                            onClick={this.handleShow.bind(this)}
                          >
                            <ReportTwoToneIcon /> Report
                          </button>
                          <Modal
                            show={this.state.show}
                            onHide={this.handleClose.bind(this)}
                          >
                            <Modal.Header>
                              <Modal.Title>
                                Are you Sure to report this post?
                              </Modal.Title>
                              <Button onClick={this.handleClose.bind(this)}>
                                x
                              </Button>
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
                        </div>
                        <Link
                          className="btn btn-clean"
                          to={{
                            pathname: `/post/${this.props._id}`,
                          }}
                        >
                          <VisibilityTwoToneIcon /> View Full Post
                        </Link>
                        <div>
                          <button
                            className="btn btn-clean"
                            onClick={() => {
                              getpost(_id).then((data) => {
                                let link = `http://localhost:3000/post/${data.post._id}`;
                                navigator.clipboard.writeText(link);
                                toast.success("Link copied to clipboard");
                              });
                            }}
                          >
                            <ShareIcon /> Share Post
                          </button>
                        </div>
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <button className="btn btn-custom">
                    <MoreVertIcon />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
            <div>
              <p className="lead ml-10 mt-5 text-dark-75 font-size-lg font-weight-normal ">
                {text}
              </p>

              <div className="d-flex align-items-center">
                <Heart isClick={this.state.isClick} onClick={this.postliked} />
                {counts + " likes"}
                {delete_button === "enabled" ? (
                  <DeletePost postId={_id} />
                ) : (
                  <div></div>
                )}
              </div>
              <div className="d-flex align-items-center">
                <TextField
                  name="comment"
                  onChange={(e) => this.onTextChange(e)}
                  id="standard-basic"
                  label="Add a Comment"
                  fullWidth
                />
                <button
                  onClick={this.submitcomment}
                  className="btn btn-light-primary mr-5 ml-5 "
                  disabled={this.state.sentimentScore < -3 ? true : false}
                >
                  <SendRoundedIcon />
                </button>
              </div>
              {comments.length > 0 ? (
                this.rendercomments(comments)
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

const mapStateToProps = (state) => ({
  posts: state.posts.posts,
});

const mapDispatchToProps = (dispatch) => ({
  changePosts: (params) => dispatch(changePosts(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextPostView);
