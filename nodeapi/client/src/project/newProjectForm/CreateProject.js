import React, { Component } from "react";
import RoleList from "./RoleCreate";
import { newProject } from "./../apiProject";
import SkillsInput from "./../../utils/signupbutton/Tagify/SkillsInput";
import LiveClock from "react-live-clock";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";

class CreateProject extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      skills: [""],
      error: "",
      roleDetails: [
        {
          index: Math.random(),
          roleName: "",
          roleSkills: [],
        },
      ],
      open: false,
    };
  }

  handleChange = (proj) => (event) => {
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

  clickSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: "" });
    let { title, description, skills, roleDetails } = this.state;
    await roleDetails.map((role, i) => {
      if (role.roleSkills.length === 0) {
        this.setState({ error: "Empty skills for role Number " + (i + 1) });
      }
      if (role.roleName === "")
        this.setState({ error: "Empty role title at " + (i + 1) });
    });
    let project = {
      title,
      description,
      skills,
      roleDetails,
    };

    // newProject(project);
    try {
      // console.log(this.state.error);
      if (this.state.error === "" && this.state.error !== undefined) {
        newProject(project).then((data) => {
          if (data === undefined) return;
          if (data.error) {
            if (data.similar) {
              this.setState({ similar: data.similar });
              console.log(this.state.similar);
            }
            this.setState({ error: data.error });
          } else
            this.setState({
              title: "",
              description: "",
              skills: [""],
              roleDetails: [
                {
                  index: Math.random(),
                  roleName: "",
                  roleSkills: [],
                },
              ],
              error: "",
              open: true,
            });
        });
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(project);
  };

  render() {
    let { error, title, description, skills, roleDetails, open } = this.state;
    return (
      <>
        <div
          className="subheader py-2 py-lg-6  subheader-transparent "
          id="kt_subheader"
        >
          <div className=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <div className="d-flex align-items-center flex-wrap mr-2">
              <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">
                Create Project
              </h5>
              <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
            </div>
            <div class="d-flex align-items-center flex-wrap">
              <Badge variant="primary">
                <div className="d-flex align-items-center flex-wrap mr-2">
                  <h6>{dayjs().format("DD MMMM, dddd")}</h6>
                  <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 ml-4 bg-gray-200"></div>
                  <h6>
                    <LiveClock format="hh:mm a" ticking />
                  </h6>
                </div>
              </Badge>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <h2>Let's Start a New Project</h2>
                <p className="text-muted">
                  Fill in the form with all the necessary details to register
                  the project.
                </p>
              </div>
            </div>
            <div className="card-body">
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
                Project Successfully Registered. Check "My Projects".
              </div>
              <form className="mt-5">
                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-10 offset-1">
                      <label>
                        <big>Title of your Project</big>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={title}
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
                        value={description}
                        onChange={this.handleChange("description")}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-10 offset-1">
                      <SkillsInput
                        label={<big>Skills</big>}
                        setSkills={this.handleSkills}
                      />
                    </div>
                  </div>
                  {/*<RoleView />*/}
                  <RoleList
                    add={this.addNewRow}
                    delete={this.clickOnDelete.bind(this)}
                    roleDetails={roleDetails}
                    onChange={this.handleRoleChange}
                  />
                  <div className="row">
                    <button
                      onClick={this.clickSubmit}
                      className="btn btn-raised btn-primary mx-auto mt-3 mb-2 col-sm-3"
                    >
                      Create Project!
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default CreateProject;
