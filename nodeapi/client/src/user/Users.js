import React, { Component } from "react";
import {
  list,
  getCurrentUser,
  followUser,
  unfollowUser,
  getUserById,
  unblockUser,
} from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateFollowing } from "../store/user";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import LiveClock from "react-live-clock";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import { isAuthenticated } from "../auth";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import SearchUserBar from "./SearchUserBar";
import { notificationAdded } from "../store/notifications";
import { ToastContainer } from "react-toastify";
const onUnBlockUser = (e, user) => {
  let current_user_id = getCurrentUser()._id;
  let client_user_id = user._id;
  console.log(user);
  unblockUser(current_user_id, client_user_id)
    .then((data) => {
      console.log(data);
    })
    .then(() => window.location.reload());
  e.preventDefault();
};

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      blocked_users: [],
    };
  }
  componentDidMount() {
    // console.log(getCurrentUser());
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
        let othersProfilePics = {};
        data.map((user) => {
          getUserById(user._id).then((data) => {
            const profilePic =
              data.user.profilePictures.length !== 0
                ? data.user.profilePictures[
                    data.user.profilePictures.length - 1
                  ]
                : DefaultProfile;
            othersProfilePics[user._id] = profilePic;
            this.setState({ othersProfilePics });
            // this.props.setProfilePic({ profilePic });
          });
        });
      }
    });
    getUserById(getCurrentUser()._id).then((data) => {
      this.props.updateFollowing({
        following: data.user.following,
      });
      this.setState({
        blocked_users: data.user.blocked_users,
      });
    });
  }
  componentDidUpdate(prevState, prevProps) {
    console.log(prevState);
    console.log(prevProps);
  }

  renderUsers = (users, othersProfilePics) => (
    <div className="row row-cols-1 row-cols-md-4">
      {users.map((user, i) => (
        <div className="col mb-4" key={i}>
          <div className="card card-custom card-stretch">
            <div className="card-body pt-4">
              <div className="d-flex align-items-center">
                <img
                  src={othersProfilePics[user._id]}
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
                  <Link
                    to={`/mychats/${isAuthenticated().user._id}`}
                    className="btn btn-outline-primary"
                  >
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
                          (data) => {
                            this.props.updateFollowing({
                              following: data.user.following,
                            });
                            this.props.notificationAdded({
                              userId: user._id,
                              message: `${
                                getCurrentUser().name
                              } has followed you.`,
                              type: "FollowedYou",
                              userObjId: getCurrentUser()._id,
                            });
                            this.props.notificationAdded({
                              userId: getCurrentUser()._id,
                              message: `Followed ${user.name}!`,
                              type: "StartedFollowing",
                              userObjId: user._id,
                            });
                          }
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

  renderBlockedUsers = (users, othersProfilePics) => (
    <div className="row row-cols-1 row-cols-md-4">
      {users.map((user, i) => (
        <div className="col mb-4" key={i}>
          <div className="card card-custom card-stretch">
            <div className="card-body pt-4">
              <div className="d-flex align-items-center">
                <img
                  src={othersProfilePics[user._id]}
                  alt={user.name}
                  className="symbol symbol-60 symbol-xxl-100 mr-3 align-self-start align-self-xxl-center"
                  style={{ width: "55px" }}
                />
                <div>
                  <h5 className="font-weight-bolder text-dark-75 text-hover-primary">
                    {user.name}
                  </h5>
                  <div className="text-muted pb-3">@{user.username}</div>
                  <button
                    className="btn btn-primary"
                    onClick={async (e) => {
                      onUnBlockUser(e, user);
                    }}
                  >
                    UnBlock
                    <CheckCircleOutlineIcon />
                  </button>
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
    users = users.filter((x) => x._id !== getCurrentUser()._id);
    let final_users = users.filter(
      (x) => !this.state.blocked_users.includes(x._id)
    );
    const { othersProfilePics } = this.state;
    if (othersProfilePics === undefined) return null;
    let final_blocked = users.filter((x) =>
      this.state.blocked_users.includes(x._id)
    );
    console.log(final_blocked);
    return (
      <>
        <ToastContainer />
        <div
          className="subheader py-2 py-lg-6  subheader-transparent "
          id="kt_subheader"
        >
          <div className=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <div className="d-flex align-items-center flex-wrap mr-2">
              <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">
                Users
              </h5>
              <span>
                <SearchUserBar />
              </span>
            </div>
            <div class="d-flex align-items-center flex-wrap">
              <Badge variant="primary">
                <div className="d-flex align-items-center flex-wrap mr-2">
                  <h6>{dayjs().format("DD MMMM, dddd")}</h6>
                  <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 ml-4 bg-gray-200"></div>
                  <h6>
                    <LiveClock format="hh:mm a" ticking />
                  </h6>
                </div>
              </Badge>
            </div>
          </div>
        </div>
        <div className="container">
          <h2 className="mt-5 mb-5">Users</h2>
          {this.renderUsers(final_users, othersProfilePics)}

          <h2 className="mt-5 mb-5">Blocked Users</h2>
          {this.renderBlockedUsers(final_blocked, othersProfilePics)}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  following: state.user.following,
});

const mapDispatchToProps = (dispatch) => ({
  updateFollowing: (params) => dispatch(updateFollowing(params)),
  notificationAdded: (params) => dispatch(notificationAdded(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
