import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import DeleteUser from "./DeleteUser";
import { Row, Tab, Col, Nav } from "react-bootstrap";
import PersonTwoToneIcon from "@material-ui/icons/PersonTwoTone";
import ChatTwoToneIcon from "@material-ui/icons/ChatTwoTone";
import AccountTreeTwoToneIcon from "@material-ui/icons/AccountTreeTwoTone";
import DonutChart from "react-donut-chart";
import { listmyprojects } from "./../project/apiProject";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignin: false,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
    listmyprojects().then((projects) => {
      this.setState({ projects: projects.userProjects });
    });
  }
  // this.setState({ projects });

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }
  render() {
    const { redirectToSignin, user } = this.state;
    if (user.skills === undefined) return null;
    if (redirectToSignin) return <Redirect to="/signin" />;
    let projects = this.state.projects;
    let ongoing = 0;
    let completed = 0;
    let overdue = 0;
    if (projects !== undefined) {
      projects.map((project) => {
        if (project.status === "Completed") completed++;
        if (project.status === "In Progress") ongoing++;
      });
    }
    return (
      <div className="container mt-5">
        <Tab.Container id="left-tabs-example" defaultActiveKey="personalInfo">
          <Row>
            <Col sm={3}>
              <div className="card card-custom card-stretch">
                <div className="card-body pt-4">
                  <div className="d-flex align-items-center">
                    <img
                      src={DefaultProfile}
                      alt={user.name}
                      className="symbol symbol-60 symbol-xxl-100 mr-3 align-self-start align-self-xxl-center"
                      style={{ width: "55px" }}
                    />
                    <div>
                      <h5 className="font-weight-bolder text-dark-75 text-hover-primary">
                        {user.name}
                      </h5>
                      <div className="text-muted">@{user.username}</div>
                      <div className="mt-2">
                        <Link
                          className="btn btn-sm btn-primary mr-2 py-2 px-3 px-xxl-5 my-1"
                          to={`/user/edit/${user._id}`}
                        >
                          Edit Profile
                        </Link>
                        <DeleteUser userId={user._id} />
                      </div>
                    </div>
                  </div>
                  <div className=" pt-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="font-weight-bold mr-2">Email: </span>
                      <span className="text-muted email-wrap text-hover-primary">
                        {user.email}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="font-weight-bold mr-2">Location: </span>
                      <span className="text-muted text-hover-primary">
                        {user.location}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="font-weight-bold mr-2">Joined: </span>
                      <span className="text-muted text-hover-primary">
                        {` ${new Date(user.created).toDateString()}`}
                      </span>
                    </div>
                  </div>
                  <Nav variant="pills" className="flex-column mt-3">
                    <Nav.Item>
                      <Nav.Link eventKey="personalInfo">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <PersonTwoToneIcon />
                          </div>
                          <div>Personal Information</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="socialInfo">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <ChatTwoToneIcon />
                          </div>
                          <div>Social Information</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="projInfo">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <AccountTreeTwoToneIcon />
                          </div>
                          <div>Project Stats</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="personalInfo">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Personal Information
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Update your personal information.
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <th>Name</th>
                            <td>{user.name}</td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>{user.email}</td>
                          </tr>
                          <tr>
                            <th>Bio</th>
                            <td>{user.bio}</td>
                          </tr>
                          <tr>
                            <th>Skills</th>
                            <td>{user.skills.join(" ")}</td>
                          </tr>
                          <tr>
                            <th>Date of Birth</th>
                            <td>{` ${new Date(user.dob).toDateString()}`}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="socialInfo">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Social Information
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Update your personal information.
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <th>Website</th>
                            <td>
                              {user.social.website
                                ? user.social.website
                                : "Not available"}
                            </td>
                          </tr>
                          <tr>
                            <th>Instagram</th>
                            <td>
                              {user.social.instagram
                                ? user.social.instagram
                                : "Not available"}
                            </td>
                          </tr>
                          <tr>
                            <th>Facebook</th>
                            <td>
                              {user.social.facebook
                                ? user.social.facebook
                                : "Not available"}
                            </td>
                          </tr>
                          <tr>
                            <th>Linkedin</th>
                            <td>
                              {user.social.linkedin
                                ? user.social.linkedin
                                : "Not available"}
                            </td>
                          </tr>
                          <tr>
                            <th>Twitter</th>
                            <td>
                              {user.social.twitter
                                ? user.social.twitter
                                : "Not available"}
                            </td>
                          </tr>
                          <tr>
                            <th>Youtube</th>
                            <td>
                              {user.social.youtube
                                ? user.social.youtube
                                : "Not available"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="projInfo">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Project Stats
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Statistics of your projects
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <table className="table table-borderless">
                        <DonutChart
                          data={[
                            {
                              label: "Ongoing Projects",
                              value: ongoing,
                            },
                            {
                              label: "Overdue Projects",
                              value: 1,
                            },
                            {
                              label: "Completed Projects",
                              value: completed,
                            },
                          ]}
                          innerRadius="0.6"
                        />
                      </table>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

export default Profile;
