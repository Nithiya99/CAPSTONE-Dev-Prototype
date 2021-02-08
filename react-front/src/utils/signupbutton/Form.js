import React, { useState, Component } from "react";
import { Modal, Button } from "react-bootstrap";
import User from "./User";
import Personal from "./Personal";
import Social from "./Social";
import { signup } from "../../auth/index";

class Form extends Component {
  state = {
    step: 1,
    name: "",
    dob: new Date(),
    location: "",
    bio: "",
    website: "",
    github: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    username: "",
    email: "",
    password: "",
    error: "",
    open: false,
  };
  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };

  inputChange = (input) => (e) => {
    this.setState({ error: "" });
    this.setState({
      [input]: e.target !== undefined ? e.target.value : e,
    });
  };
  submitStep = () => {
    let user = this.state;
    signup(user).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          open: true,
        });
    });
  };
  render() {
    const { step, error, open } = this.state;
    const {
      name,
      bio,
      dob,
      location,
      github,
      facebook,
      instagram,
      linkedin,
      twitter,
      youtube,
      website,
      username,
      email,
      password,
    } = this.state;
    const values = {
      name,
      bio,
      dob,
      location,
      github,
      facebook,
      instagram,
      linkedin,
      twitter,
      youtube,
      website,
      username,
      email,
      password,
    };
    switch (step) {
      case 1:
        return (
          <>
            <div
              className="alert alert-danger"
              style={{ display: error ? "" : "none" }}
            >
              {error}
            </div>

            <div
              className="alert alert-success"
              style={{ display: open ? "" : "none" }}
            >
              New account successfully created! Please Sign In.
            </div>
            <Personal
              values={values}
              inputChange={this.inputChange}
              nextStep={this.nextStep}
            />
          </>
        );
      //   case 2:
      //     return <Education />;
      //   case 3:
      //     return <Experience />;
      case 2:
        return (
          <>
            <div
              className="alert alert-danger"
              style={{ display: error ? "" : "none" }}
            >
              {error}
            </div>

            <div
              className="alert alert-success"
              style={{ display: open ? "" : "none" }}
            >
              New account successfully created! Please Sign In.
            </div>
            <Social
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              inputChange={this.inputChange}
              values={values}
            />
          </>
        );
      case 3:
        return (
          <>
            <div
              className="alert alert-danger"
              style={{ display: error ? "" : "none" }}
            >
              {error}
            </div>

            <div
              className="alert alert-success"
              style={{ display: open ? "" : "none" }}
            >
              New account successfully created! Please Sign In.
            </div>
            <User
              submitStep={this.submitStep}
              prevStep={this.prevStep}
              inputChange={this.inputChange}
              values={values}
            />
          </>
        );
    }
  }
}

export default Form;
