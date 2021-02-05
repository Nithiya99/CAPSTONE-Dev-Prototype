import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import "./styles.css";
// import NavBar from "./core/NavBar";

const MainRouter = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Menu />
          </div>
          <div className="col-md-9">
            <Switch>
              <Route exact path="/home" component={Home}></Route>
              <Route exact path="/users" component={Users}></Route>
              <Route
                exact
                path="/user/edit/:userId"
                component={EditProfile}
              ></Route>
              <Route exact path="/user/:userId" component={Profile}></Route>
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainRouter;
