import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import DeleteUser from "./DeleteUser";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignin: false,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }
  render() {
    const { redirectToSignin, user } = this.state;
    if (user.skills === undefined) return null;
    if (redirectToSignin) return <Redirect to="/signin" />;
    return (
      <div className="container">
        <div className="card mt-5">
          <div className="row no-gutters">
            <div className="col-md-4">
              <img
                className="img-fluid ml-3"
                src={DefaultProfile}
                alt={user.name}
                style={{ width: "30vh", height: "30vh" }}
              />
            </div>
            <div className="col-md-8">
              {console.log(user)}
              <div className="card-body">
                <h4 className="card-text">{user.name}</h4>
                <p className="card-text">Email: {user.email}</p>
                <p className="card-text">Username: {user.username}</p>
                <p className="card-text">Bio: </p>
                <p className="card-text text-muted">{user.bio}</p>
                <p className="card-text">Skills: </p>
                <p className="card-text text-muted">{user.skills.join(" ")}</p>
                <p className="card-text">Location: </p>
                <p className="card-text text-muted">{user.location}</p>
                <p className="card-text">
                  {`Date Of Birth: ${new Date(user.dob).toDateString()}`}
                </p>
                <p className="card-text text-muted">
                  {`Joined: ${new Date(user.created).toDateString()}`}
                </p>
                <div className="card mt-2 mb-2 p-2">
                  <p className="card-title">Social</p>
                  <p className="card-text">
                    Website:{" "}
                    {user.social.website
                      ? user.social.website
                      : "Not available"}
                  </p>
                  <p className="card-text">
                    Instagram:{" "}
                    {user.social.instagram
                      ? user.social.instagram
                      : "Not available"}
                  </p>
                  <p className="card-text">
                    Facebook:{" "}
                    {user.social.facebook
                      ? user.social.facebook
                      : "Not available"}
                  </p>
                  <p className="card-text">
                    Linkedin:{" "}
                    {user.social.linkedin
                      ? user.social.linkedin
                      : "Not available"}
                  </p>
                  <p className="card-text">
                    Twitter:{" "}
                    {user.social.twitter
                      ? user.social.twitter
                      : "Not available"}
                  </p>
                  <p className="card-text">
                    Youtube:{" "}
                    {user.social.youtube
                      ? user.social.youtube
                      : "Not available"}
                  </p>
                </div>
                {isAuthenticated().user &&
                  isAuthenticated().user._id === user._id && (
                    <div className="inline-block">
                      <Link
                        className="btn btn-raised btn-primary mr-5"
                        to={`/user/edit/${user._id}`}
                      >
                        Edit Profile
                      </Link>
                      <DeleteUser userId={user._id} />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
