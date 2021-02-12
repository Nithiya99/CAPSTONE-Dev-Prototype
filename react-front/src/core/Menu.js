import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import "../styles.css";

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return { backgroundColor: "rgb(0 123 255)", color: "#fff" };
  else return { color: "#000" };
};

const Menu = ({ history }) => {
  return (
    <>
      {isAuthenticated() && (
        <div className="list-group mt-5">
          <div
            style={isActive(history, "/home")}
            className="list-group-item list-group-item-action"
          >
            <Link style={isActive(history, "/home")} to={"/home"}>
              Home
            </Link>
          </div>

          <div
            style={isActive(history, "/createproject")}
            className="list-group-item list-group-item-action"
          >
            <Link
              style={isActive(history, "/createproject")}
              to={`/createproject`}
            >
              Create Project
            </Link>
          </div>

          <div
            style={isActive(history, `/user/${isAuthenticated().user._id}`)}
            className="list-group-item list-group-item-action"
          >
            <Link
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              to={`/user/${isAuthenticated().user._id}`}
            >
              My Profile
            </Link>
          </div>

          <div
            style={isActive(history, "/users")}
            className="list-group-item list-group-item-action"
          >
            <Link style={isActive(history, "/users")} to={"/users"}>
              Users
            </Link>
          </div>

          <div className="list-group-item list-group-item-action">
            <span
              style={
                (isActive(history, "/signup"),
                { cursor: "pointer", color: "#000" })
              }
              onClick={() => signout(() => history.push("/"))}
            >
              Sign Out
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(Menu);
