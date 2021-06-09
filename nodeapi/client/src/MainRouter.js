import React, { useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";
import Signin from "./user/Signin";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import "./styles.css";
import "./style.bundle.css";
import NavBar from "./core/NavBar";
import CreateProject from "./project/newProjectForm/CreateProject";
import JoinProject from "./project/JoinProject";
import MyProjects from "./project/MyProjects";
import ProjectDashboard from "./project/ProjectDashboard";
import EditProject from "./project/EditProject";
import { useDispatch } from "react-redux";
import Notifications from "./core/Notifications";
import MyChats from "./user/MyChats";
import Landing from "./core/Landing";
import LiveClock from "react-live-clock";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";
import showPost from "./posts/showPost";
import Recommendation from "./user/Recommendation";
import viewProject from "./project/viewProject";

const MainRouter = () => {
  const dispatch = useDispatch();

  return (
    <body
      id="kt_body"
      className="header-fixed header-mobile-fixed subheader-enabled page-loading"
    >
      <Menu />
      <div
        className="content  d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="d-flex flex-column-fluid">
          <div className="container">
            <Switch>
              <Route exact path="/" component={Landing}></Route>
              <Route path="/signin" component={Signin}></Route>
              <Route path="/home" component={Home}></Route>
              <Route path="/users" component={Users}></Route>
              <Route path="/createproject" component={CreateProject}></Route>
              <Route path="/joinproject" component={JoinProject}></Route>
              <Route exact path="/myprojects" component={MyProjects}></Route>
              <Route
                path="/myprojects/dashboard/:projectId"
                component={ProjectDashboard}
              ></Route>
              <Route
                path="/myprojects/edit/:projectId"
                component={EditProject}
              ></Route>
              <Route path="/notifs/:userId" component={Notifications}></Route>
              <Route path="/mychats/:userId" component={MyChats}></Route>
              <Route path="/user/edit/:userId" component={EditProfile}></Route>
              <Route path="/user/:userId" component={Profile}></Route>
              <Route path="/post/:postId" component={showPost}></Route>
              <Route path="/project/:projectId" component={viewProject}></Route>
              {/* <Route path="/recommendation" component={Recommendation}></Route> */}
            </Switch>
          </div>
        </div>
      </div>
    </body>
  );
};

export default MainRouter;
