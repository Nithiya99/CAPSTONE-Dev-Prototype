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
    <div className="row row-cols-1 row-cols-md-4">
      {users.map((user, i) => (
        <div className="col mb-4" key={i}>
          <div className="card card-custom card-stretch">
            <div className="card-body pt-4">
              <div className="d-flex align-items-center">
                <img
                  src={DefaultProfile}
                  alt={user.name}
                  className="symbol symbol-60 symbol-xxl-100 mr-3 align-self-start align-self-xxl-center"
                  style={{ width: "55px" }}
                />
                <div>
                  <h5 className="font-weight-bolder text-dark-75 text-hover-primary">
                    {user.name}
                  </h5>
                  <div className="text-muted pb-3">@{user.username}</div>
                  <Link
                    to={`/user/${user._id}`}
                    className="btn btn-raised btn-small btn-primary"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="pt-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <Link to="#" className="btn btn-outline-primary">
                    Message
                  </Link>
                  <Link to="#" className="btn btn-outline-success">
                    Follow
                  </Link>
                </div>
              </div>
            </div>
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
