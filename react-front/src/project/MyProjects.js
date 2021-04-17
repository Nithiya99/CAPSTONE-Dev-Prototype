import React, { Component } from "react";
import { listmyprojects } from "./apiProject";
import {
  OverlayTrigger,
  Tooltip,
  Accordion,
  Button,
  Card,
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
class MyProjects extends Component {
  state = {
    myProjects: [],
    currentProject: {},
    user: {},
  };
  componentDidMount() {
    listmyprojects().then((data) => this.setState({ myProjects: data }));
    toast.dark("Loaded");
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
      <div className="mt-5">
        <ToastContainer />
        <h2>My Projects</h2>
        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Ongoing Projects
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <div className="row row-cols-1 row-cols-md-2">
                  {onGoingProjects.map((project) => (
                    <div className="col mb-4">
                      <div className="card text-white bg-primary ">
                        <div className="card-header">
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="card-label  text-darker">
                              {project.title}
                            </h5>

                            <div className="card-toolbar">
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

                                    <DeleteProject projectId={project._id} />
                                    {project.completion_percentage === 100 ? (
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
                        </div>
                        <div className="card-body">
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
                          <table className="table table-dark">
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
                                    {project.leader === getCurrentUser()._id &&
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
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Overdue Projects
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>Check with group if Overdue has been added.</Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                Completed Projects
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <div className="row row-cols-1 row-cols-md-2">
                  {CompletedProjects.map((project) => (
                    <div className="col mb-4">
                      <div className="card text-white bg-success">
                        <div className="card-header">
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="card-label  text-darker">
                              {project.title}
                            </h5>

                            <div className="card-toolbar">
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
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
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
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default MyProjects;
