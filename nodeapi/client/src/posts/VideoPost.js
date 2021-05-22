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
  deleteComment,
} from "./apiPosts";
import { collect } from "collect.js";
import CommentIcon from "@material-ui/icons/Comment";
import moment from "moment";
import { Accordion, Button, Card } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import Sentiment from "sentiment";
import DeletePost from "./DeletePost";
import { connect } from "react-redux";
import { changePosts } from "../store/posts";
import Dropdown from "react-bootstrap/Dropdown";

const sentiment = new Sentiment();
class VideoPost extends Component {
  state = {
    isClick: false,
    comment: "",
    id: getCurrentUser()._id,
    sentimentScore: null,
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
    else
      likepost(this.props._id)
        .then((data) => console.log(data))
        .then(() => this.props.changePosts(this.props._id));
  };

  onTextChange = (e) => {
    this.setState({ comment: e.target.value });
    this.findSentiment(e.target.value);
  };

  submitcomment = () => {
    addcomment(this.props._id, this.state.comment).then(async (data) => {
      // console.log(data);
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
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                ...
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={(e) => this.deletecomment(e, _id)}>
                  delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      )
    );
  };

  render() {
    const {
      headerText,
      footerText,
      videoUrl,
      liked_by,
      _id,
      tags,
      comments,
      delete_button,
    } = this.props;
    let counts = collect(liked_by).count();
    return (
      <>
        <ToastContainer />
        <Card className="m-5">
          <Card.Header>
            <Link
              to={{
                pathname: `/post/${this.props._id}`,
              }}
            >
              {headerText}
            </Link>
            {/* <div>
              {tags.map((tag) => (
                <>{tag}</>
              ))}
            </div> */}
            {delete_button === "enabled" ? (
              <DeletePost postId={_id} />
            ) : (
              <div></div>
            )}
          </Card.Header>
          <Card.Body className="col d-flex justify-content-center">
            {/* <Col> */}
            <ReactPlayer
              url={videoUrl}
              controls={true}
              volume={1}
              muted={false}
            />
            {/* <Card.Img
              style={{
                width: "45vw",
                height: "30vw",
                "object-fit": "cover",
              }}
              variant="top"
              src={imageUrl}
            /> */}
            {/* </Col>
                        <Col> */}
            {/* </Col> */}
          </Card.Body>
          <Card.Body>
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
        </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoPost);
