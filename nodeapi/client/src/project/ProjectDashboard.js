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
import PersonAddTwoToneIcon from "@material-ui/icons/PersonAddTwoTone";
import ChatIcon from "@material-ui/icons/Chat";
import { getCurrentUser } from "../user/apiUser";
import { getAllPosts } from "./../posts/apiPosts";
import Post from "../posts/Post";
import VideoPost from "./../posts/VideoPost";
import Chat from "./Chat";
import { getTasks } from "./apiProject";
import { connect } from "react-redux";
import { updateTasks } from "../store/tasks";
import { clearAll, setCriticalPath } from "../store/cpm";
import RoleReq from "./RoleReq";
import AssignedTo from "./AssignedTo";
import UserRecommendation from "./UserRecommendation";

class ProjectDashboard extends Component {
  state = {
    expectedTime: {},
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
        console.log(data);
        this.setState({ posts: data.posts });
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
    return Object.keys(slacks).map((key) => (
      <div>
        Label: {key} | slack: {slacks[key].slack} | days: {slacks[key].days} |
        Overdue:
        {slacks[key].overdue ? <>Overdue</> : <>On schedule</>}
      </div>
    ));
  }
  renderCriticalPath(criticalPathArr, criticalPathObject) {
    // console.log("criticalPathArr:", criticalPathArr);
    // console.log("criticalPathObject:", criticalPathObject);
    return criticalPathArr.map((node, index) => (
      <>
        {/* {index !== 1 && index !== 2 ?*/}
        {index !== criticalPathArr.length - 1
          ? criticalPathObject[node].label.toString() + " , "
          : criticalPathObject[node].label.toString() + " ."}
        {/* : ""} */}
      </>
    ));
  }
  render() {
    if (this.props.location.state.project === undefined) {
      return null;
    }
    const { project } = this.props.location.state;
    // console.log(this.props.location);
    let today = new Date();
    let day1 = new Date(today.toUTCString());
    let day2 = new Date(project.created);
    let difference = Math.abs(day2 - day1);
    let days = parseInt(difference / (1000 * 3600 * 24));
    // console.log(days);
    const { expectedTime, slacks, criticalPath, pert } = this.props;
    const { posts } = this.state;
    // console.log(slacks);
    // if (slacks === undefined) return ;
    if (expectedTime === undefined) return null;
    return (
      <div className="pt-5">
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
                          <div>Team Information</div>
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
                                {project.leader}
                              </Link>
                            </div>
                          </div>
                          <div className="my-lg-0 my-1">
                            <button className="btn btn-light-primary">
                              Test
                            </button>
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
                              LOAD
                            </span>
                          </div>
                          <div className="mr-12 d-flex flex-column mb-7">
                            <span className="d-block font-weight-bold mb-4">
                              Due Date
                            </span>
                            <span className="btn btn-light-danger btn-sm font-weight-bold btn-upper btn-text">
                              {/* {projectEstimatedDates[project._id]} */}
                              LOAD
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
                                  <button className="btn btn-info">
                                    <PersonAddTwoToneIcon />
                                  </button>
                                </td>
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
                </Tab.Pane>
                <Tab.Pane eventKey="projStats">
                  <div className="card card-stretch">
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
                      <h4>No. of days:</h4>
                      <span>{days}</span>
                      <h4>Estimated date:</h4>
                      <span>{expectedTime}</span>
                      {slacks !== undefined ? (
                        <>
                          <h4>Tasks that can be slacked On:</h4>
                          <div>{this.renderSlacks(slacks)}</div>
                        </>
                      ) : (
                        <></>
                      )}
                      <div>
                        <div>
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
                        </div>
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
                            console.log(post.project, project._id);
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
