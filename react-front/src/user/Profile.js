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
              <div className="card-body">
                <p className="card-text">
                  <h4>{user.name}</h4>
                </p>
                <p className="card-text">Email: {user.email}</p>
                <p className="card-text text-muted">
                  {`Joined: ${new Date(user.created).toDateString()}`}
                </p>
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
