import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { clearNotifications } from "../store/notifications";
import "../styles.css";
import { Nav } from "react-bootstrap";

import { useDispatch } from "react-redux";

import { getCurrentUser } from "../user/apiUser";
import socket from "./../utils/Socket";

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return { backgroundColor: "rgb(0 123 255)", color: "#fff" };
  else return { color: "#000" };
};

const Menu = ({ history }) => {
  const dispatch = useDispatch();

  return (
    <>
      {isAuthenticated() && (
        <Nav className="col-md-1 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky"></div>
          <Nav.Item>
            <div style={isActive(history, "/home")} className="p-3">
              <Link style={isActive(history, "/home")} to={"/home"}>
                Home
              </Link>
            </div>
          </Nav.Item>
          <Nav.Item>
            <div style={isActive(history, "/createproject")} className="p-3">
              <Link
                style={isActive(history, "/createproject")}
                to={`/createproject`}
              >
                Create Project
              </Link>
            </div>
          </Nav.Item>
          <Nav.Item>
            <div style={isActive(history, "/joinproject")} className="p-3">
              <Link
                style={isActive(history, "/joinproject")}
                to={`/joinproject`}
              >
                Join Project
              </Link>
            </div>
          </Nav.Item>
          <Nav.Item>
            <div style={isActive(history, "/myprojects")} className="p-3">
              <Link style={isActive(history, "/myprojects")} to={`/myprojects`}>
                My Projects
              </Link>
            </div>
          </Nav.Item>
          <Nav.Item>
            <div
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              className="p-3"
            >
              <Link
                style={isActive(history, `/user/${isAuthenticated().user._id}`)}
                to={`/user/${isAuthenticated().user._id}`}
              >
                My Profile
              </Link>
            </div>
          </Nav.Item>
          <Nav.Item>
            <div style={isActive(history, "/users")} className="p-3">
              <Link style={isActive(history, "/users")} to={"/users"}>
                Users
              </Link>
            </div>
          </Nav.Item>
          <Nav.Item>
            <div
              style={isActive(history, `/notifs/${isAuthenticated().user._id}`)}
              className="p-3"
            >
              <Link
                style={isActive(
                  history,
                  `/notifs/${isAuthenticated().user._id}`
                )}
                to={`/notifs/${isAuthenticated().user._id}`}
              >
                Notifications
              </Link>
            </div>
          </Nav.Item>
          <Nav.Item>
            <div
              style={isActive(
                history,
                `/mychats/${isAuthenticated().user._id}`
              )}
              className="p-3"
            >
              <Link
                style={isActive(
                  history,
                  `/mychats/${isAuthenticated().user._id}`
                )}
                to={`/mychats/${isAuthenticated().user._id}`}
              >
                Chats
              </Link>
            </div>
          </Nav.Item>
          <Nav.Item>
            <div className="p-3">
              <span
                style={
                  (isActive(history, "/signup"),
                  { cursor: "pointer", color: "#000" })
                }
                onClick={() => {
                  dispatch(clearNotifications());
                  socket.emit("signout", {
                    userId: getCurrentUser()._id,
                  });
                  signout(() => history.push("/"));
                }}
              >
                Sign Out
              </span>
            </div>
          </Nav.Item>
        </Nav>
      )}
    </>
  );
};

export default withRouter(Menu);
