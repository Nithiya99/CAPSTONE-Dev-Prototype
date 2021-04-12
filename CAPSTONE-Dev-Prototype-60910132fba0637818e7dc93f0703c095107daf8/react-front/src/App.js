import React, { Component } from "react";
import MainRouter from "./MainRouter";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Signin from "./user/Signin";
import { Provider } from "react-redux";
import configureStore from "./store/store";
import { io } from "socket.io-client";
const store = configureStore();
var options = {
  rememberUpgrade: true,
  transports: ["websocket"],
  secure: true,
  rejectUnauthorized: false,
};
const socketio = io("http://localhost:8081", options);
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Signin}></Route>
          </Switch>
          <MainRouter />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
