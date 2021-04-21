import React, { Component } from "react";
import {
  list,
  getCurrentUser,
  followUser,
  unfollowUser,
  getUserById,
} from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateFollowing } from "../store/user";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
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
    getUserById(getCurrentUser()._id).then((data) => {
      this.props.updateFollowing({
        following: data.user.following,
      });
      // console.log(curUser);
    });
    // console.log(this.state.following);
  }
  componentDidUpdate(prevState, prevProps) {
    console.log(prevState);
    console.log(prevProps);
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
                  {this.props.following.includes(user._id) ? (
                    <button
                      className="btn btn-raised btn-primary ml-3"
                      onClick={(e) => {
                        unfollowUser(e, user._id).then(
                          (data) =>
                            this.props.updateFollowing({
                              following: data.user.following,
                            })
                          // console.log(data)
                        );
                      }}
                    >
                      UnFollow
                      <PersonAddDisabledIcon />
                    </button>
                  ) : (
                    <button
                      className="btn btn-raised btn-primary ml-3"
                      onClick={(e) =>
                        followUser(e, user._id).then(
                          (data) =>
                            this.props.updateFollowing({
                              following: data.user.following,
                            })
                          // console.log(data.user.following)
                        )
                      }
                    >
                      Follow
                      <PersonAddIcon />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    let users = this.state.users;
    // console.log(users);
    // console.log(this.props);
    users = users.filter((x) => x._id !== getCurrentUser()._id);
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  following: state.user.following,
});

const mapDispatchToProps = (dispatch) => ({
  updateFollowing: (params) => dispatch(updateFollowing(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
