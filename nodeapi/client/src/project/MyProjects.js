import React, { Component } from "react";
import { listmyprojects } from "./apiProject";
import {
  OverlayTrigger,
  Tooltip,
  Accordion,
  Button,
  Card,
  Tab,
  Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getCurrentUser } from "./../user/apiUser";
import RoleReq from "./RoleReq";
import AssignedTo from "./AssignedTo";
import DeleteProject from "./DeleteProject";
import LeaveProject from "./LeaveProject";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DashboardTwoToneIcon from "@material-ui/icons/DashboardTwoTone";
import SubmitProject from "./SubmitProject";
import UserRecommendation from "./UserRecommendation";
import socket from "./../utils/Socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearAll } from "../store/cpm";
import { connect } from "react-redux";
import LiveClock from "react-live-clock";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";
import QueryBuilderTwoToneIcon from "@material-ui/icons/QueryBuilderTwoTone";
import ErrorTwoToneIcon from "@material-ui/icons/ErrorTwoTone";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";

class MyProjects extends Component {
  state = {
    myProjects: [],
    currentProject: {},
    user: {},
  };
  componentDidMount() {
    listmyprojects().then((data) => this.setState({ myProjects: data }));
    // toast.dark("Loaded");
  }
  renderProject(project) {
    // return <h5>{project.title}</h5>;
    console.log(project.title);
  }
  render() {
    if (
      this.state.myProjects === undefined ||
      this.state.myProjects.length === 0
    )
      return <h1>No Projects</h1>;
    const { myProjects } = this.state;
    console.log(myProjects);
    let onGoingProjects = myProjects.userProjects.filter((x) =>
      x.status.includes("In Progress")
    );
    let CompletedProjects = myProjects.userProjects.filter((x) =>
      x.status.includes("Completed")
    );
    socket.emit("getOnlineUsers");
    socket.on("onlineUsers", (data) => console.log(data));
    return (
      <>
        <div
          className="subheader py-2 py-lg-6  subheader-transparent "
          id="kt_subheader"
        >
          <div className=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <div className="d-flex align-items-center flex-wrap mr-2">
              <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">
                My Projects
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
            <Tab.Container id="projectStats" defaultActiveKey="ongoingProj">
              <div className="card-header">
                <div className="card-title">
                  <Nav variant="pills">
                    <Nav.Item>
                      <Nav.Link eventKey="ongoingProj">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <QueryBuilderTwoToneIcon />
                          </div>
                          <div>Ongoing Projects</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="overdueProj">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <ErrorTwoToneIcon />
                          </div>
                          <div>Overdue Projects</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="completedProj">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <CheckCircleTwoToneIcon />
                          </div>
                          <div>Completed Projects</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <div className="card-body">
                <Tab.Content>
                  <Tab.Pane eventKey="ongoingProj">
                    <div className="row row-cols-1 row-cols-md-2">
                      {onGoingProjects.map((project) => (
                        <div className="col mb-4">
                          <div className="card card-custom gutter-b card-stretch">
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="d-flex-flex-column mr-auto">
                                  <p className="card-title font-weight-bolder font-size-h5 text-dark mb-1">
                                    {project.title}
                                  </p>
                                  <span className="text-muted font-weight-bold">
                                    {project.leader} [Load username]
                                  </span>
                                </div>
                                <div className="card-toolbar mb-auto">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <OverlayTrigger
                                      key="top"
                                      placement="top"
                                      overlay={
                                        <Tooltip id="top2">
                                          Project Dashboard
                                        </Tooltip>
                                      }
                                    >
                                      <Link
                                        className="btn btn-info mr-2"
                                        to={{
                                          pathname: `/myprojects/dashboard/${project._id}`,
                                          state: { project: project },
                                        }}
                                      >
                                        <DashboardTwoToneIcon />
                                      </Link>
                                    </OverlayTrigger>
                                    {getCurrentUser()._id === project.leader ? (
                                      <div className="d-flex align-items-center justify-content-between">
                                        <OverlayTrigger
                                          key="top"
                                          placement="top"
                                          overlay={
                                            <Tooltip id="tooltip-top">
                                              Edit Project
                                            </Tooltip>
                                          }
                                        >
                                          <Link
                                            className="btn btn-warning mr-2"
                                            to={{
                                              pathname: `/myprojects/edit/${project._id}`,
                                              state: { project: project },
                                            }}
                                          >
                                            <EditTwoToneIcon />
                                          </Link>
                                        </OverlayTrigger>

                                        <DeleteProject
                                          projectId={project._id}
                                        />
                                        {project.completion_percentage ===
                                        100 ? (
                                          <SubmitProject
                                            projectId={project._id}
                                            projectTeam={project.team}
                                            projectLeader={project.leader}
                                          />
                                        ) : (
                                          <div> </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div>
                                        <LeaveProject project={project} />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex flex-wrap mt-14">
                                <div className="mr-12 d-flex flex-column mb-7">
                                  <span className="d-block font-weight-bold mb-4">
                                    Start Date
                                  </span>
                                  <span className="btn btn-light-primary btn-sm font-weight-bold btn-upper btn-text">
                                    [Load]
                                  </span>
                                </div>
                                <div className="mr-12 d-flex flex-column mb-7">
                                  <span className="d-block font-weight-bold mb-4">
                                    Due Date
                                  </span>
                                  <span className="btn btn-light-primary btn-sm font-weight-bold btn-upper btn-text">
                                    [Load]
                                  </span>
                                </div>
                                <div className="flex-row-fluid mb-7">
                                  <span className="d-block font-weight-bold mb-4">
                                    Progress
                                  </span>
                                  <div className="d-flex align-items-center pt-2">
                                    <div className="progress progress-xs mt-2 mb-2 w-100">
                                      <div
                                        className="progress-bar bg-warning"
                                        role="progressbar"
                                        style={{ width: "78%" }}
                                        aria-valuenow="50"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                      ></div>
                                    </div>
                                    <span className="ml-3 font-weight-bolder">
                                      78%[L]
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="font-weight-bold mr-2">
                                  Description:{" "}
                                </span>
                                <span>{project.description}</span>
                              </div>
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="font-weight-bold mr-2">
                                  Skills:{" "}
                                </span>
                                <span>{project.skills.join(", ")}</span>
                              </div>
                              <table className="table table-light">
                                <thead>
                                  <tr>
                                    <th key={"rolename"}>Role Name</th>
                                    <th key={"skills"}>Skills Required</th>

                                    <th key={"assigned"}>Assigned To</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {project.roles.map((role) => (
                                    <tr key={role._id.toString()}>
                                      <td
                                        key={
                                          role._id.toString() +
                                          role.roleName.toString()
                                        }
                                      >
                                        {role.roleName}
                                      </td>
                                      <td
                                        key={
                                          role._id.toString() +
                                          role.roleSkills.toString()
                                        }
                                      >
                                        {role.roleSkills.join(", ")}
                                      </td>
                                      <td>
                                        {project.leader ===
                                          getCurrentUser()._id &&
                                        role.assignedTo === undefined ? (
                                          <div>
                                            <RoleReq
                                              requestBy={role.requestBy}
                                              projectId={project._id}
                                              roleId={role._id}
                                            />
                                          </div>
                                        ) : (
                                          <div>
                                            <AssignedTo id={role.assignedTo} />
                                          </div>
                                        )}
                                      </td>
                                      <td></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {getCurrentUser()._id === project.leader ? (
                                <UserRecommendation project={project} />
                              ) : (
                                <div></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="completedProj">
                    <div className="row row-cols-1 row-cols-md-2">
                      {CompletedProjects.map((project) => (
                        <div className="col mb-4">
                          <div className="card card-custom gutter-b card-stretch">
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="d-flex-flex-column mr-auto">
                                  <p className="card-title font-weight-bolder font-size-h5 text-dark mb-1">
                                    {project.title}
                                  </p>
                                  <span className="text-muted font-weight-bold">
                                    {project.leader} [Load username]
                                  </span>
                                </div>
                                <div className="card-toolbar mb-auto">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <OverlayTrigger
                                      key="top"
                                      placement="top"
                                      overlay={
                                        <Tooltip id="top2">
                                          Project Dashboard
                                        </Tooltip>
                                      }
                                    >
                                      <Link
                                        className="btn btn-info mr-2"
                                        to={{
                                          pathname: `/myprojects/dashboard/${project._id}`,
                                          state: { project: project },
                                        }}
                                      >
                                        <DashboardTwoToneIcon />
                                      </Link>
                                    </OverlayTrigger>
                                    {getCurrentUser()._id === project.leader ? (
                                      <div className="d-flex align-items-center justify-content-between">
                                        <OverlayTrigger
                                          key="top"
                                          placement="top"
                                          overlay={
                                            <Tooltip id="tooltip-top">
                                              Edit Project
                                            </Tooltip>
                                          }
                                        >
                                          <Link
                                            className="btn btn-warning mr-2"
                                            to={{
                                              pathname: `/myprojects/edit/${project._id}`,
                                              state: { project: project },
                                            }}
                                          >
                                            <EditTwoToneIcon />
                                          </Link>
                                        </OverlayTrigger>

                                        <DeleteProject
                                          projectId={project._id}
                                        />
                                        {project.completion_percentage ===
                                        100 ? (
                                          <SubmitProject
                                            projectId={project._id}
                                            projectTeam={project.team}
                                            projectLeader={project.leader}
                                          />
                                        ) : (
                                          <div> </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div>
                                        <LeaveProject project={project} />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex flex-wrap mt-14">
                                <div className="mr-12 d-flex flex-column mb-7">
                                  <span className="d-block font-weight-bold mb-4">
                                    Start Date
                                  </span>
                                  <span className="btn btn-light-primary btn-sm font-weight-bold btn-upper btn-text">
                                    [Load]
                                  </span>
                                </div>
                                <div className="mr-12 d-flex flex-column mb-7">
                                  <span className="d-block font-weight-bold mb-4">
                                    Due Date
                                  </span>
                                  <span className="btn btn-light-primary btn-sm font-weight-bold btn-upper btn-text">
                                    [Load]
                                  </span>
                                </div>
                                <div className="flex-row-fluid mb-7">
                                  <span className="d-block font-weight-bold mb-4">
                                    Progress
                                  </span>
                                  <div className="d-flex align-items-center pt-2">
                                    <div className="progress progress-xs mt-2 mb-2 w-100">
                                      <div
                                        className="progress-bar bg-warning"
                                        role="progressbar"
                                        style={{ width: "100%" }}
                                        aria-valuenow="50"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                      ></div>
                                    </div>
                                    <span className="ml-3 font-weight-bolder">
                                      100%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="font-weight-bold mr-2">
                                  Description:{" "}
                                </span>
                                <span>{project.description}</span>
                              </div>
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="font-weight-bold mr-2">
                                  Skills:{" "}
                                </span>
                                <span>{project.skills.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="overdueProj">
                    <p>Check with group if Overdue has been added.</p>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </div>
      </>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  clearAll: (params) => dispatch(clearAll(params)),
});

export default connect(null, mapDispatchToProps)(MyProjects);
