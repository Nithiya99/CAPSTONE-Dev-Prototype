import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import "./styles.css";
// import NavBar from "./core/NavBar";
import CreateProject from "./project/newProjectForm/CreateProject";
import JoinProject from "./project/JoinProject";
import MyProjects from "./project/MyProjects";
import ProjectDashboard from "./project/ProjectDashboard";
import EditProject from "./project/EditProject";

const MainRouter = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Menu />
          </div>
          <div className="col-md-11">
            <Switch>
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
              <Route path="/user/edit/:userId" component={EditProfile}></Route>
              <Route path="/user/:userId" component={Profile}></Route>
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainRouter;
