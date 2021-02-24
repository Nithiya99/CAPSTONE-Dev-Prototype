import React, { Component } from "react";
import SkillsInput from "./../utils/signupbutton/Tagify/SkillsInput";
import RoleList from "./newProjectForm/RoleCreate";

export default class EditProject extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      skills: [],
      error: "",
      roleDetails: [],
      open: false,
    };
  }
  componentDidMount() {
    let { project } = this.props.location.state;
    this.setState({
      title: project.title,
      description: project.description,
      skills: project.skills,
      roles: project.roles,
    });
    let str = "";
    project.skills.map((skill) => {
      str += skill;
      str += ",";
    });
    str = str.slice(0, -1);
    this.setState({ skillstr: str });
  }

  handleChange = (proj) => (event) => {
    console.log(proj);
    console.log(event.target.value);
    this.setState({ error: "" });
    this.setState({ [proj]: event.target.value });
  };
  handleSkills = (newSkills) => {
    this.setState({ skills: newSkills });
  };
  handleRoleChange = (name) => (e) => {
    let id = parseInt(e.target.attributes.idx.value);
    const roleDetails = this.state.roleDetails;
    roleDetails[id][name] = e.target.value;
    this.setState({ roleDetails });
  };

  addNewRow = (e) => {
    this.setState((prevState) => ({
      roleDetails: [
        ...prevState.roleDetails,
        {
          index: Math.random(),
          roleName: "",
          roleSkills: "",
        },
      ],
    }));
  };

  deteteRow = (index) => {
    this.setState({
      roleDetails: this.state.roleDetails.filter(
        (s, sindex) => index !== sindex
      ),
    });
  };

  clickOnDelete(record) {
    this.setState({
      roleDetails: this.state.roleDetails.filter((r) => r !== record),
    });
  }

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    let { title, description, skills, roleDetails } = this.state;
    let project = {
      title,
      description,
      skills,
      roleDetails,
    };
  };
  render() {
    if (this.props.location.state.project === undefined) {
      return null;
    }
    const { project } = this.props.location.state;
    return (
      <div className="mt-5">
        <h1>Edit Project</h1>
        <p className="text-muted">
          Change the desired info and click save at the end of the form.
        </p>
        <form className="mt-5">
          <div className="form-group">
            <div className="row">
              <div className="col-sm-10 offset-1">
                <label>
                  <big>Title of your Project</big>
                </label>
                <input
                  className="form-control"
                  value={this.state.title}
                  type="text"
                  onChange={this.handleChange("title")}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-10 offset-1">
                <label>
                  <big>Description of the Project</big>
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.description}
                  onChange={this.handleChange("description")}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-10 offset-1">
                <SkillsInput
                  label={<big>Skills</big>}
                  setSkills={this.handleSkills}
                  value={this.state.skillstr}
                />
              </div>
            </div>
            {/*<RoleView />*/}

            <div className="row">
              <button className="btn btn-raised btn-primary mx-auto mt-3 mb-2 col-sm-3">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
