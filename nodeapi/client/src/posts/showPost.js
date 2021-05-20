import React, { Component } from "react";
import ShareIcon from "@material-ui/icons/Share";
import { ToastContainer, toast } from "react-toastify";
import Heart from "react-animated-heart";
import { getCurrentUser } from "./../user/apiUser";
import { likepost, dislikepost, addcomment, getpost } from "./apiPosts";
import { collect } from "collect.js";
import CommentIcon from "@material-ui/icons/Comment";
import moment from "moment";
import { Accordion, Button, Card } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { isAuthenticated } from "../auth";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

class showPost extends Component {
  state = {
    isClick: false,
    comment: "",
    id: String,
    post: {},
    loggedin: false,
    post_id: String,
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
  };

  submitcomment = () => {
    if (this.state.loggedin) {
      addcomment(this.state.post_id, this.state.comment).then((data) =>
        console.log(data)
      );
    } else return toast.error("Please login-In ");
  };

  rendercomments = (comments) => {
    return comments.map(({ PostedOn, comment, userName }, index) => (
      <div>
        <div>
          <span className="font-weight-bold font-size-lg ">{userName}</span>
        </div>
        <div className="text-muted font-size-sm">
          {comment + " " + moment(PostedOn).format("DD-MM-YYYY h:mm a")}
        </div>
      </div>
    ));
  };

  render() {
    let post = this.state.post.post;
    const current_post = { ...post };
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
        <Card className="m-5">
          <Card.Header>{current_post.title}</Card.Header>
          <Card.Body className="col d-flex justify-content-center">
            {/* <Col> */}
            {imageUrl !== "undefined" && imageUrl.length > 1 ? (
              <Carousel>
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
            )}
            {/* </Col>
                        <Col> */}
            {/* </Col> */}
          </Card.Body>
          <Card.Body>
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
                    >
                      Submit
                    </button>
                    {collect(current_post.comments).count() > 0 ? (
                      this.rendercomments(current_post.comments)
                    ) : (
                      <p>No Comments</p>
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Card.Body>
          <Card.Footer>{posted_by.name}</Card.Footer>
        </Card>
      </>
    );
  }
}

export default showPost;
