import React, { Component } from "react";
import { Accordion, Card, Button, Row, Tab, Col, Nav } from "react-bootstrap";
import AddTask from "./taskComponents/AddTask";
import LayoutComponent from "./layout/LayoutComponent";
import TrelloTask from "./taskComponents/TrelloTask";
import GroupTwoToneIcon from "@material-ui/icons/GroupTwoTone";
import AccountTreeTwoToneIcon from "@material-ui/icons/AccountTreeTwoTone";
import TuneTwoToneIcon from "@material-ui/icons/TuneTwoTone";
import PlaylistAddTwoToneIcon from "@material-ui/icons/PlaylistAddTwoTone";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import ChatIcon from "@material-ui/icons/Chat";
import { getCurrentUser } from "../user/apiUser";
import Chat from "./Chat";
import { getTasks } from "./apiProject";
import { connect } from "react-redux";
import { updateTasks } from "../store/tasks";
import { clearAll } from "../store/cpm";

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
    const { expectedTime, slacks } = this.props;
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
                  </Nav>
                </div>
              </div>
            </Col>
            <Col sm={10}>
              <Tab.Content>
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
                          <span>
                            {Object.keys(slacks).map((key) => {
                              <div>
                                {console.log(key, slacks[key])}
                                {key} : {slacks[key]}
                              </div>;
                            })}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                      <div>{console.log(this.props.pert.criticalPath)}</div>
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
                {getCurrentUser().id === project.leader ? (
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
                ) : (
                  <></>
                )}
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
});

const mapDispatchToProps = (dispatch) => ({
  updateTasks: (params) => dispatch(updateTasks(params)),
  clearAll: () => dispatch(clearAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDashboard);
