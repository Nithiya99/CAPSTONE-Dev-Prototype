import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { signin, authenticate } from "./../auth/index";
import bgImg from "../images/bg-01.jpg";
import "../styles.css";
import { Link } from "react-router-dom";
import Signup from "./Signup";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false,
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };
    // console.log(user);
    signin(user).then((data) => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
      }
    });
  };

  render() {
    const { email, password, error, redirectToReferer, loading } = this.state;

    if (redirectToReferer) {
      return <Redirect to="/home" />;
    }

    return (
      <div className="container-fluid signin-wrapper">
        <div className="row h-100">
          <div className="col-md-8"></div>
          <div className="col-md-4">
            <div class="d-flex align-items-center bd-highlight h-100">
              <div class="box w-100">
                <div
                  className="alert alert-danger mb-5 col-sm-8 offset-2"
                  style={{ display: error ? "" : "none" }}
                >
                  {error}
                </div>

                {loading ? (
                  <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                  </div>
                ) : (
                  ""
                )}
                <h1 className="text-center">Let's get back to work!</h1>

                <form className="mt-5">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-10 offset-1">
                        <label>
                          <big>Email</big>
                        </label>
                        <input
                          className="form-control"
                          onChange={this.handleChange("email")}
                          value={email}
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-sm-10 offset-1">
                        <label>
                          <big>Password</big>
                        </label>
                        <input
                          className="form-control"
                          onChange={this.handleChange("password")}
                          value={password}
                          type="password"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <button
                        onClick={this.clickSubmit}
                        className="btn btn-raised btn-primary mx-auto mt-3 mb-2 col-sm-3"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </form>
                <p className="text-muted text-center mt-5">
                  Want to join the community?
                  <Signup />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signin;
