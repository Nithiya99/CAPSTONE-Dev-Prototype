import React, { Component } from "react";
import ShareIcon from "@material-ui/icons/Share";
import { ToastContainer, toast } from "react-toastify";
import Heart from "react-animated-heart";
import { getCurrentUser } from "./../user/apiUser";
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
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
import Dropdown from "react-bootstrap/Dropdown";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import Sentiment from "sentiment";
import YouTubeIcon from "@material-ui/icons/YouTube";
import * as youtubeMeta from "youtube-metadata-from-url";
import DeletePost from "./DeletePost";
import ReactPlayer from "react-player/youtube";
import { connect } from "react-redux";
import { changePosts } from "../store/posts";

const sentiment = new Sentiment();
class YoutubePost extends Component {
  state = {
    isClick: false,
    comment: "",
    id: getCurrentUser()._id,
    sentimentScore: null,
    // metadata: {},
  };

  componentDidMount() {
    let users = this.props.liked_by;
    if (users !== undefined && users !== null && users !== [])
      if (users.indexOf(getCurrentUser()._id) > -1)
        this.setState({ isClick: true });
    // youtubeMeta
    //   .metadata(this.props.url)
    // //   .bind(this)
    //   .then(
    //     function (json) {
    //       //   console.log("Response:", json);
    //       this.setState({ metadata: json });
    //     },
    //     function (err) {
    //       console.log(err);
    //     }
    //   );
  }
  postliked = () => {
    this.setState({ isClick: !this.state.isClick });
    if (this.state.isClick)
      dislikepost(this.props._id)
        .then((data) => console.log(data))
        .then(() => this.props.changePosts(this.props._id));
    else
      likepost(this.props._id)
        .then((data) => console.log(data))
        .then(() => this.props.changePosts(this.props._id));
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
    addcomment(this.props._id, this.state.comment).then(async (data) => {
      await this.props.changePosts(this.props._id);
    });
  };

  findSentiment(comment) {
    const result = sentiment.analyze(comment);
    this.setState({
      sentimentScore: result.score,
    });
  }

  deletecomment(e, commentId) {
    e.preventDefault();
    deleteComment(commentId, this.props._id).then((data) => console.log(data));
  }

  rendercomments = (comments) => {
    let reverseComments = [...comments].reverse();
    return reverseComments.map(
      ({ PostedOn, comment, userName, _id, userId }, index) => (
        <div>
          <div>
            <span className="font-weight-bold font-size-lg ">{userName}</span>
          </div>
          <div className="text-muted font-size-sm">
            {comment + " " + moment(PostedOn).format("DD-MM-YYYY h:mm a")}
          </div>
          {this.state.id === userId && (
            <button
              className="btn btn-danger"
              onClick={(e) => this.deletecomment(e, _id)}
            >
              Delete
            </button>
          )}
        </div>
      )
    );
  };

  render() {
    const {
      headerText,
      footerText,
      url,
      liked_by,
      _id,
      tags,
      comments,
      metadataTitle,
      metadataAuthor,
      delete_button,
      created,
    } = this.props;
    // const { metadata } = this.state;
    let counts = collect(liked_by).count();
    // console.log("metadataTitle:", metadataTitle);
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
                  {created}[Load Date and Time]
                </span>
              </div>
              <div className="ml-auto">
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={
                    <Popover id="popover-basic">
                      <Popover.Title as="h3">Popover right</Popover.Title>
                      <Popover.Content>
                        <div>
                          <button
                            className="btn btn-light-danger"
                            disabled={this.state.isDisabled}
                            onClick={this.handleShow.bind(this)}
                          >
                            Report
                          </button>
                        </div>
                        <Link
                          className="font-size-lg font-weight-bolder"
                          to={{
                            pathname: `/post/${this.props._id}`,
                          }}
                        >
                          View Full Post
                        </Link>
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
              <p className="text-dark-75 font-size-lg font-weight-normal">
                <YouTubeIcon />
                {/* <a href={text} target={"_blank"}>
                {text.toString()} {console.log(metadata)}
                </a> */}
                <div>{metadataTitle}</div>
                <center>
                  <ReactPlayer url={url} controls={true} width={window.width} />
                </center>
                <div>By {metadataAuthor}</div>
              </p>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    getpost(_id).then((data) => {
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
                {delete_button === "enabled" ? (
                  <DeletePost postId={_id} />
                ) : (
                  <div></div>
                )}
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
              {comments.length > 0 ? (
                this.rendercomments(comments)
              ) : (
                <p>No Comments</p>
              )}
            </div>
          </div>
          <Card.Body>
            <button
              disabled={this.state.isDisabled}
              onClick={this.handleShow.bind(this)}
            >
              Report
            </button>
            <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
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
                getpost(_id).then((data) => {
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
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Comment <CommentIcon />
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <TextField
                      name="comment"
                      onChange={(e) => this.onTextChange(e)}
                      variant="outlined"
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
                    {comments.length > 0 ? (
                      this.rendercomments(comments)
                    ) : (
                      <p>No Comments</p>
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Card.Body>
          <Card.Footer>{footerText}</Card.Footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(YoutubePost);
