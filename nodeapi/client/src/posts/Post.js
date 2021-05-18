import React, { Component } from "react";
import ShareIcon from "@material-ui/icons/Share";
import { ToastContainer, toast } from "react-toastify";
import Heart from "react-animated-heart";
import { getCurrentUser } from "./../user/apiUser";
import { likepost, dislikepost, addcomment, getpost } from "./apiPosts";
import { collect } from "collect.js";
import CommentIcon from "@material-ui/icons/Comment";
import { FacebookSelector, GithubSelector } from "react-reactions";
import { Accordion, Button, Card } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
class Post extends Component {
  state = {
    isClick: false,
    comment: "",
    id: getCurrentUser()._id,
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
      dislikepost(this.props._id).then((data) => console.log(data));
    else likepost(this.props._id).then((data) => console.log(data));
  };

  select = (e) => {
    console.log(e);
  };

  onTextChange = (e) => {
    this.setState({ comment: e.target.value });
  };

  submitcomment = () => {
    console.log(this.state.comment);
    addcomment(this.props._id, this.state.comment).then((data) =>
      console.log(data)
    );
  };

  render() {
    const { headerText, footerText, imageUrl, liked_by, _id, tags, comments } =
      this.props;
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
          </Card.Header>
          <Card.Body className="col d-flex justify-content-center">
            {/* <Col> */}
            <Card.Img
              style={{
                width: "45vw",
                height: "30vw",
                "object-fit": "cover",
              }}
              variant="top"
              src={imageUrl}
            />
            {/* </Col>
                        <Col> */}
            {/* </Col> */}
          </Card.Body>
          <Card.Body>
            <button
              onClick={() => {
                getpost(_id).then((data) => {
                  console.log(data);
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
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            {/* <FacebookSelector onSelect={this.select} />
            <GithubSelector onSelect={this.select} /> */}
          </Card.Body>
          <Card.Footer>{footerText}</Card.Footer>
        </Card>
      </>
    );
  }
}

export default Post;
