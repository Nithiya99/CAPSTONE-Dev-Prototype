import React, { Component } from "react";
import { Accordion, Card, Button, Row, Tab, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddTask from "./taskComponents/AddTask";
import LayoutComponent from "./layout/LayoutComponent";
import TrelloTask from "./taskComponents/TrelloTask";
import GroupTwoToneIcon from "@material-ui/icons/GroupTwoTone";
import AccountTreeTwoToneIcon from "@material-ui/icons/AccountTreeTwoTone";
import TuneTwoToneIcon from "@material-ui/icons/TuneTwoTone";
import PlaylistAddTwoToneIcon from "@material-ui/icons/PlaylistAddTwoTone";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import ChatIcon from "@material-ui/icons/Chat";
import { getCurrentUser, getUserById } from "../user/apiUser";
import { getAllPosts } from "./../posts/apiPosts";
import Post from "../posts/Post";
import VideoPost from "./../posts/VideoPost";
import Chat from "./Chat";
import { getTasks } from "./apiProject";
import { connect } from "react-redux";
import { updateTasks } from "../store/tasks";
import { clearAll } from "../store/cpm";
import RoleReq from "./RoleReq";
import AssignedTo from "./AssignedTo";
import UserRecommendation from "./UserRecommendation";
import moment from "moment";
import RecommendedRolePeople from "./RecommendedRolePeople";
import { ToastContainer } from "react-toastify";
import StartIcon from "../images/victory.png";

class ProjectDashboard extends Component {
  state = {
    expectedTime: {},
    leaderName: "",
    assignedTo: {},
    assignedUser: {},
  };
  componentDidMount() {
    this.props.clearAll();
    const { project } = this.props.location.state;
    getTasks(project._id).then((val) => {
      this.props.updateTasks({
        tasks: val.tasks,
      });
    });
    getAllPosts()
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        this.setState({ posts: data.posts });
      });
    getUserById(project.leader).then((data) =>
      this.setState({ leaderName: data.user.name })
    );

    let tasks = project.tasks;
    let Obj = {};
    tasks.map(async (task) => {
      let names = [];
      if (task.assignedTo !== undefined)
        await task.assignedTo.map(async (user) => {
          await getUserById(user).then((data) => {
            names.push(data.user.name);
          });
        });
      Object.assign(Obj, { [task._id]: names });
    });
    this.setState({
      assignedUser: Obj,
    });
  }
  // componentDidUpdate(prevState) {
  //   if (prevState.connections.length !== this.props.connections.length) {
  //     // if (this.props.pert.latestFinishTimes !== undefined)
  //     //   console.log("end time:", this.props.pert.latestFinishTimes.__end);
  //     const expectedTime =
  //       this.props.pert.latestFinishTimes !== undefined
  //         ? Math.floor(this.props.pert.latestFinishTimes.__end)
  //         : "Not set yet";
  //     this.setState({ expectedTime });
  //     this.props.setExpectedTime({ expectedTime });
  //   }
  //   // console.log(prevState);
  // }
  renderSlacks(slacks) {
    if (slacks === undefined) return null;
    return Object.keys(slacks).map((key) => (
      <div>
        {slacks[key].slack > 0 && (
          <div className="col mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="d-flex flex-column flex-grow-1">
                    <div className="text-dark-100 mb-1 font-size-lg font-weight-bolder">
                      {key}
                    </div>
                  </div>
                  {slacks[key].overdue ? (
                    <span className="btn btn-light-danger btn-sm font-weight-bold btn-upper btn-text">
                      Overdue
                    </span>
                  ) : (
                    <span className="btn btn-light-success btn-sm font-weight-bold btn-upper btn-text">
                      On schedule
                    </span>
                  )}
                </div>

                <p className="card-text pt-3">Days left: {slacks[key].days}</p>
                <p className="card-text">
                  Number of Days you can Slack: {slacks[key].slack} [CHECK]
                </p>
                <p className="card-text">
                  Start By:{" "}
                  <span className="btn btn-light-success btn-sm font-weight-bold btn-upper btn-text">
                    {moment(slacks[key].earliestStartDate).format("DD-MM-YYYY")}
                  </span>
                </p>
                <p className="card-text">
                  Due on:{" "}
                  <span className="btn btn-light-danger btn-sm font-weight-bold btn-upper btn-text">
                    {moment(slacks[key].earliestFinishDate).format(
                      "DD-MM-YYYY"
                    )}
                  </span>
                </p>
                <p className="card-text">
                  Assigned To:{" "}
                  <span className="btn btn-light-info btn-sm font-weight-bold btn-upper btn-text">
                    LOADs
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Label: {key} | slack: {slacks[key].slack} | days: {slacks[key].days} |
        Overdue:
        {slacks[key].overdue ? <>Overdue</> : <>On schedule</>} */}
      </div>
    ));
  }
  renderCriticalPath(criticalPathArr, criticalPathObject) {
    console.log("criticalPathArr:", criticalPathArr);
    console.log("criticalPathObject:", criticalPathObject);
    let str = "";
    let assignedUser = this.state.assignedUser;
    return criticalPathArr.map((node, index) => (
      <div className="col mb-4">
        <div className="card">
          <div className="card-body">
            <div className="text-dark-100 mb-1 font-size-lg font-weight-bolder">
              {/* {index !== 1 && index !== 2 ?*/}
              {index !== criticalPathArr.length - 1
                ? criticalPathObject[node].label.toString()
                : criticalPathObject[node].label.toString()}
              {/* : ""} */}
            </div>
            <p className="card-text">
              {index !== criticalPathArr.length - 1
                ? criticalPathObject[node].taskDescription
                : criticalPathObject[node].taskDescription}
            </p>
            <p className="card-text">
              Status:{" "}
              <span className="btn btn-light-success btn-sm font-weight-bold btn-upper btn-text">
                {index !== criticalPathArr.length - 1
                  ? criticalPathObject[node].status
                  : criticalPathObject[node].status}
              </span>
            </p>
            <p className="card-text">
              Assigned To:{" "}
              <span className="btn btn-light-info btn-sm font-weight-bold btn-upper btn-text">
                {console.log(assignedUser[criticalPathObject[node]._id])}
                {(str = "")}
                {assignedUser[criticalPathObject[node]._id] !== undefined &&
                  assignedUser[criticalPathObject[node]._id].map((user) => {
                    str += user + " ";
                  })}
                {str}{" "}
              </span>
            </p>
            <p className="card-text">
              Due Date:
              <span className="btn btn-light-danger btn-sm font-weight-bold btn-upper btn-text">
                {moment(criticalPathObject[node].created)
                  .add(criticalPathObject[node].time, "days")
                  .format("DD-MM-YY")}
                {/* {index !== criticalPathArr.length - 1
                  ? moment(criticalPathObject[node].created).format(
                      "DD-MM-YYYY"
                    )
                  : moment(criticalPathObject[node].created).format(
                      "DD-MM-YYYY"
                    )}{" "} */}
              </span>
            </p>
          </div>
        </div>
      </div>
    ));
  }
  render() {
    if (this.props.location.state.project === undefined) {
      return null;
    }
    if (this.state.leaderName === undefined) return null;

    const { project } = this.props.location.state;
    // console.log(this.props.location);
    // 25/5 26/5     23/6
    // estimated date : 23/6
    // no of days left : 23/6 - 26/5
    console.log(this.props.pert);
    let today = new Date();
    let day1 = new Date(today.toUTCString());
    // let day2 = new Date(project.created);
    // let difference = Math.abs(day2 - day1);
    // let days = parseInt(difference / (1000 * 3600 * 24));
    // console.log(days);
    const { expectedTime, slacks, criticalPath, pert } = this.props;
    const { posts, leaderName } = this.state;
    let createDate = new Date(project.created);
    let expectedDate = moment(createDate, "DD-MM-YYYY").add(
      expectedTime,
      "days"
    );
    const diffTime = Math.abs(expectedDate._d - day1);
    const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log("no. of days left:", duration);
    // console.log("expectedDate : ", expectedDate.format("DD-MM-YYYY"));
    // console.log(slacks);
    // if (slacks === undefined) return ;
    if (expectedTime === undefined) return null;
    return (
      <div className="pt-5">
        <ToastContainer />
        <Tab.Container id="left-tabs-example" defaultActiveKey="projStats">
          <Row>
            <Col sm={2}>
              <div className="card card-custom card-stretch">
                <div className="card-body pt-4">
                  <h5 className="font-weight-bolder text-dark-75 text-hover-primary">
                    {project.title}
                  </h5>
                  <div className="text-muted">{project.description}</div>
                  <Nav variant="pills" className="flex-column mt-3">
                    <Nav.Item>
                      <Nav.Link eventKey="teamInfo">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <GroupTwoToneIcon />
                          </div>
                          <div>Team Information </div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="projStats">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <TuneTwoToneIcon />
                          </div>
                          <div>Project Stats</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    {project.status !== "Completed" &&
                    getCurrentUser()._id === project.leader ? (
                      <Nav.Item>
                        <Nav.Link eventKey="addTask">
                          <div className="d-flex align-items-center">
                            <div className="mr-3">
                              <PlaylistAddTwoToneIcon />
                            </div>
                            <div>Add Task</div>
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                    ) : (
                      <div> </div>
                    )}
                    <Nav.Item>
                      <Nav.Link eventKey="netDiagram">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <AccountTreeTwoToneIcon />
                          </div>
                          <div>Network Diagram</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="allTasks">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <ListAltTwoToneIcon />
                          </div>
                          <div>All Tasks</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Chat">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <ChatIcon />
                          </div>
                          <div>Group Chat</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Posts">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <PhotoLibraryIcon />
                          </div>
                          <div>Posts</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="teamInfo">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Team Information
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Analysis of the tasks and time required displayed
                          here.
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="col mb-4">
                        {/* {console.log(project.completion_percentage)} */}
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <div className="mr-3">
                            <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">
                              {project.title}
                            </div>
                            <div className="d-flex flex-wrap my-2">
                              <Link
                                to="#"
                                className="text-muted text-hover-primary font-weight-bold mr-lg-8 mr-5 mb-lg-0 mb-2"
                              >
                                {leaderName}
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow-1 font-weight-bold font-size-h6 py-5 py-lg-2 mr-5">
                          {project.description}
                        </div>
                        <div className="flex-grow-1 font-weight-bold font-size-h6 py-5 py-lg-2 mr-5">
                          {project.skills.map((skill) => (
                            <span class="btn btn-light-info btn-sm font-weight-bold btn-upper btn-text m-1">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="d-flex flex-wrap align-items-center py-2">
                          <div className="mr-12 d-flex flex-column mb-7">
                            <span className="d-block font-weight-bold mb-4">
                              Start Date
                            </span>
                            <span className="btn btn-light-primary btn-sm font-weight-bold btn-upper btn-text">
                              {/* {projectCreatedDates[project._id]} */}
                              {moment(createDate).format("DD-MM-YYYY")}
                            </span>
                          </div>
                          <div className="mr-12 d-flex flex-column mb-7">
                            <span className="d-block font-weight-bold mb-4">
                              Due Date
                            </span>
                            <span className="btn btn-light-danger btn-sm font-weight-bold btn-upper btn-text">
                              {/* {projectEstimatedDates[project._id]} */}
                              {expectedDate.format("DD-MM-YYYY")}
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
                                  style={{
                                    width: `${project.completion_percentage}%`,
                                  }}
                                  aria-valuenow="50"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="ml-3 font-weight-bolder">
                                {project.completion_percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <table className="table table-light">
                          <thead>
                            <tr>
                              <th key={"rolename"}>Role Name</th>
                              <th key={"skills"}>Skills Required</th>
                              <th key={"assigned"}>Assigned To</th>
                              <th key={"invite"}>Send Invite</th>
                            </tr>
                          </thead>
                          <tbody>
                            {project.roles.map((role) => (
                              <>
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
                                  <td>
                                    {getCurrentUser()._id === project.leader &&
                                    role.assignedTo === undefined ? (
                                      <button className="btn btn-info">
                                        <RecommendedRolePeople
                                          project={project}
                                          role={role}
                                        />
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                </tr>
                              </>
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
                </Tab.Pane>
                <Tab.Pane eventKey="projStats">
                  <div className="card card-stretch  projectDashboard">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Project Stats
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Analysis of the tasks and time required displayed
                          here.
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      {/* <h4>No. of days:</h4>
                      <span>{duration}</span>
                      <h4>Estimated date:</h4>
                      <span>{expectedDate.format("DD-MM-YYYY")}</span> */}
                      {slacks !== undefined ? (
                        <>
                          {/* <h4>Tasks that can be slacked On:</h4>
                          <div>{this.renderSlacks(slacks)}</div> */}
                        </>
                      ) : (
                        <></>
                      )}
                      <div>
                        {/* <div>
                          <h4>Critical Path:</h4>
                        </div>
                        <div>
                          {pert.criticalPath !== undefined &&
                          criticalPath !== undefined ? (
                            this.renderCriticalPath(
                              pert.criticalPath,
                              criticalPath
                            )
                          ) : (
                            <></>
                          )}
                        </div> */}
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="d-flex align-items-center mb-9 bg-light-primary rounded p-5">
                            <div className="d-flex flex-column flex-grow-1 mr-2">
                              <div className="font-weight-bold text-dark-100 font-size-lg mb-1">
                                Start Date:{" "}
                              </div>
                            </div>
                            <span className="font-weight-bolder text-primary py-1 font-size-lg">
                              LOAD
                            </span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center mb-9 bg-light-warning rounded p-5">
                            <div className="d-flex flex-column flex-grow-1 mr-2">
                              <div className="font-weight-bold text-dark-100 font-size-lg mb-1">
                                Days Left:{" "}
                              </div>
                            </div>
                            <span className="font-weight-bolder text-warning py-1 font-size-lg">
                              {duration}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center mb-9 bg-light-danger rounded p-5">
                            <div className="d-flex flex-column flex-grow-1 mr-2">
                              <div className="font-weight-bold text-dark-100 font-size-lg mb-1">
                                End Date:{" "}
                              </div>
                            </div>
                            <span className="font-weight-bolder text-danger py-1 font-size-lg">
                              {expectedDate.format("DD-MM-YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="d-flex align-items-center mb-9 bg-light-primary rounded p-5">
                            <div className="d-flex flex-column flex-grow-1 mr-2">
                              <div className="font-weight-bold text-dark-100 font-size-lg mb-1">
                                To Do Tasks:{" "}
                              </div>
                            </div>
                            <span className="font-weight-bolder text-primary py-1 font-size-lg">
                              LOAD
                            </span>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="d-flex align-items-center mb-9 bg-light-info rounded p-5">
                            <div className="d-flex flex-column flex-grow-1 mr-2">
                              <div className="font-weight-bold text-dark-100 font-size-lg mb-1">
                                Ongoing Tasks:{" "}
                              </div>
                            </div>
                            <span className="font-weight-bolder text-info py-1 font-size-lg">
                              LOAD
                            </span>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="d-flex align-items-center mb-9 bg-light-warning rounded p-5">
                            <div className="d-flex flex-column flex-grow-1 mr-2">
                              <div className="font-weight-bold text-dark-100 font-size-lg mb-1">
                                Reviewing Tasks:{" "}
                              </div>
                            </div>
                            <span className="font-weight-bolder text-warning py-1 font-size-lg">
                              LOAD
                            </span>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="d-flex align-items-center mb-9 bg-light-success rounded p-5">
                            <div className="d-flex flex-column flex-grow-1 mr-2">
                              <div className="font-weight-bold text-dark-100 font-size-lg mb-1">
                                Completed Tasks:{" "}
                              </div>
                            </div>
                            <span className="font-weight-bolder text-success py-1 font-size-lg">
                              LOAD
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="border-top my-5"></div>
                      <h4>Tasks of high priority</h4>
                      <p className="text-muted">
                        These tasks have to be competed within due date to
                        ensure that the project gets completed on time
                      </p>
                      <div className="row row-cols-1 row-cols-md-3">
                        {pert.criticalPath !== undefined &&
                        criticalPath !== undefined ? (
                          this.renderCriticalPath(
                            pert.criticalPath,
                            criticalPath
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="border-top my-5"></div>
                      <h4>Tasks that have Slack Time</h4>
                      <p className="text-muted">
                        The following tasks have more time than initially
                        assigned
                      </p>
                      <div className="row row-cols-1 row-cols-md-3">
                        {this.renderSlacks(slacks)}
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="netDiagram">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Network Diagram
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Task dependency diagram.
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <LayoutComponent project={project} />
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="allTasks">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Tasks Board
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Complete allocated tasks.
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <TrelloTask
                        projectId={project._id}
                        status={project.status}
                      />
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="addTask">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Create Task
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Add Tasks and allocate to memebers.
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <AddTask projectId={project._id} />
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="Chat">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Group Chat
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          Interact with your Project-mates.
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <Chat projectId={project._id} status={project.status} />
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="Posts">
                  <div className="card card-stretch">
                    <div className="card-header">
                      <div className="card-title align-items-start flex-column">
                        <h4 className="card-label font-weight-bolder text-dark">
                          Posts
                        </h4>
                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                          News Feed (Posts) will be here
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      {posts !== undefined &&
                        posts.map((post) => {
                          if (
                            post.project !== undefined &&
                            post.project.toString() === project._id.toString()
                          ) {
                            // console.log(post.project, project._id);
                            if (post.postType === "video")
                              return (
                                <VideoPost
                                  headerText={post.title}
                                  footerText={"by " + post.postedBy.name}
                                  cardText={post.video}
                                  videoUrl={post.video}
                                  liked_by={post.liked_by}
                                  _id={post._id}
                                  comments={post.comments}
                                  tags={post.tags}
                                  postedBy={post.postedBy}
                                />
                              );
                            if (post.postType === "image")
                              return (
                                <Post
                                  headerText={post.title}
                                  footerText={"by " + post.postedBy.name}
                                  cardText={post.photo}
                                  imageUrl={post.photo}
                                  liked_by={post.liked_by}
                                  _id={post._id}
                                  comments={post.comments}
                                  tags={post.tags}
                                  postedBy={post.postedBy}
                                />
                              );
                          }
                        })}
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
const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks,
  pert: state.cpm.pert,
  connections: state.cpm.connections,
  expectedTime: state.cpm.expectedTime,
  slacks: state.cpm.slacks,
  criticalPath: state.cpm.criticalPath,
});

const mapDispatchToProps = (dispatch) => ({
  updateTasks: (params) => dispatch(updateTasks(params)),
  clearAll: () => dispatch(clearAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDashboard);
