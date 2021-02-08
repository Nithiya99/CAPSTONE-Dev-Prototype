import React, { Component } from "react";
import { list } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import { Link } from "react-router-dom";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  renderUsers = (users) => (
    <div className="card-deck">
      {users.map((user, i) => (
        <div className="card col-md-4" key={i}>
          <img
            className="card-img-top mx-auto"
            src={DefaultProfile}
            alt={user.name}
            style={{ width: "15vh" }}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <p className="card-text">{user.username}</p>
            <p className="card-text">{user.bio}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-small btn-primary"
            >
              View Profile
            </Link>
            <Link to="#" className="btn btn-outline-primary">
              Message
            </Link>
            <Link to="#" className="btn btn-outline-success">
              Follow
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
