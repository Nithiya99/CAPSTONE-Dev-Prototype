import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read, update } from "./apiUser";
import { Redirect } from "react-router-dom";
import SkillsInput from "../utils/signupbutton/Tagify/SkillsInput";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          username: data.username,
          location: data.location,
          bio: data.bio,
          dob: data.dob,
          skills: data.skills,
          social: data.social,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };
  handleSkills = (newSkills) => {
    this.setState({ skills: newSkills });
  };
  handleSocialChange = (name) => (event) => {
    const social = Object.assign({}, this.state.social, {
      [name]: event.target.value,
    });
    this.setState({ social });
  };
  clickSubmit = (event) => {
    event.preventDefault();
    const {
      name,
      username,
      email,
      password,
      location,
      bio,
      social,
      skills,
    } = this.state;
    const user = {
      name,
      username,
      email,
      location,
      bio,
      social,
      skills,
      password: password || undefined,
    };
    // console.log(user);
    const userId = this.props.match.params.userId;
    const token = isAuthenticated().token;
    update(userId, token, user).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          redirectToProfile: true,
        });
    });
    // console.log(user);
  };

  render() {
    const {
      id,
      name,
      email,
      password,
      username,
      location,
      bio,
      social,
      redirectToProfile,
      error,
      skills,
    } = this.state;
    const skillString = () => {
      let str = "";
      skills.map((skill) => {
        str += skill;
        str += ",";
      });
      str = str.slice(0, -1);
      return str;
    };
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }
    if (social === undefined) return null;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <form>
          <div className="form-group">
            <label>Username</label>
            <input
              onChange={this.handleChange("username")}
              type="text"
              className="form-control"
              value={username}
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              onChange={this.handleChange("name")}
              type="text"
              className="form-control"
              value={name}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              onChange={this.handleChange("email")}
              type="email"
              className="form-control"
              value={email}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              onChange={this.handleChange("password")}
              type="password"
              className="form-control"
              value={password}
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <input
              onChange={this.handleChange("bio")}
              type="text"
              className="form-control"
              value={bio}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              onChange={this.handleChange("location")}
              type="text"
              className="form-control"
              value={location}
            />
          </div>
          <div className="form-group">
            <SkillsInput
              label={"Skills"}
              setSkills={this.handleSkills}
              value={skillString()}
            />
          </div>
          <div className="form-group">
            <label>Instagram</label>
            <input
              onChange={this.handleSocialChange("instagram")}
              type="text"
              className="form-control"
              value={social.instagram}
            />
          </div>
          <div className="form-group">
            <label>Facebook</label>
            <input
              onChange={this.handleSocialChange("facebook")}
              type="text"
              className="form-control"
              value={social.instagram}
            />
          </div>
          <div className="form-group">
            <label>Your Website</label>
            <input
              onChange={this.handleSocialChange("website")}
              type="text"
              className="form-control"
              value={social.website}
            />
          </div>
          <div className="form-group">
            <label>Linkedin</label>
            <input
              onChange={this.handleSocialChange("linkedin")}
              type="text"
              className="form-control"
              value={social.linkedin}
            />
          </div>
          <div className="form-group">
            <label>Youtube</label>
            <input
              onChange={this.handleSocialChange("youtube")}
              type="text"
              className="form-control"
              value={social.youtube}
            />
          </div>
          <div className="form-group">
            <label>Twitter</label>
            <input
              onChange={this.handleSocialChange("twitter")}
              type="text"
              className="form-control"
              value={social.twitter}
            />
          </div>
          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-primary"
          >
            Update
          </button>
        </form>
      </div>
    );
  }
}

export default EditProfile;
