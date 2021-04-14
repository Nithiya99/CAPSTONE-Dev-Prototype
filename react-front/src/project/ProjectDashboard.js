import React, { Component } from "react";
import { Accordion, Card, Button, Row, Tab, Col, Nav } from "react-bootstrap";
import AddTask from "./taskComponents/AddTask";
import MyTasks from "./taskComponents/MyTask";
import LayoutComponent from "./layout/LayoutComponent";
import TrelloTask from "./taskComponents/TrelloTask";
import GroupTwoToneIcon from "@material-ui/icons/GroupTwoTone";
import AccountTreeTwoToneIcon from "@material-ui/icons/AccountTreeTwoTone";
import TuneTwoToneIcon from "@material-ui/icons/TuneTwoTone";
import PlaylistAddTwoToneIcon from "@material-ui/icons/PlaylistAddTwoTone";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import { getCurrentUser } from "../user/apiUser";

class ProjectDashboard extends Component {
  render() {
    if (this.props.location.state.project === undefined) {
      return null;
    }
    const { project } = this.props.location.state;
    // console.log(project);
    // console.log(this.props.location);
    return (
      <div className="pt-5">
        {
          // <div className="mt-5">
          //   <h1>{project.title}'s Dasboard</h1>
          //   <Accordion defaultActiveKey="0">
          //     {project.status === "Completed" ? (
          //       <> </>
          //     ) : (
          //       <>
          //         {getCurrentUser()._id === project.leader ? (
          //           <Card>
          //             <Card.Header>
          //               <Accordion.Toggle as={Button} variant="link" eventKey="0">
          //                 Add Task
          //               </Accordion.Toggle>
          //             </Card.Header>
          //             <Accordion.Collapse eventKey="0">
          //               <Card.Body>
          //                 <AddTask projectId={project._id} />
          //               </Card.Body>
          //             </Accordion.Collapse>
          //           </Card>
          //         ) : (
          //           <> </>
          //         )}
          //       </>
          //     )}
          //     <Card>
          //       <Card.Header>
          //         <Accordion.Toggle as={Button} variant="link" eventKey="1">
          //           Show Tasks
          //         </Accordion.Toggle>
          //       </Card.Header>
          //       <Accordion.Collapse eventKey="1">
          //         <Card.Body>
          //           <MyTasks projectId={project._id} status={project.status} />
          //         </Card.Body>
          //       </Accordion.Collapse>
          //     </Card>
          //     <Card>
          //       <Card.Header>
          //         <Accordion.Toggle as={Button} variant="link" eventKey="2">
          //           Connect Tasks with Graphic layout
          //         </Accordion.Toggle>
          //       </Card.Header>
          //       <Accordion.Collapse eventKey="2">
          //         <Card.Body>
          //           <LayoutComponent project={project} />
          //         </Card.Body>
          //       </Accordion.Collapse>
          //     </Card>
          //     <Card>
          //       <Card.Header>
          //         <Accordion.Toggle as={Button} variant="link" eventKey="3">
          //           Trello
          //         </Accordion.Toggle>
          //       </Card.Header>
          //       <Accordion.Collapse eventKey="3">
          //         <Card.Body>
          //           <TrelloTask projectId={project._id} status={project.status} />
          //         </Card.Body>
          //       </Accordion.Collapse>
          //     </Card>
          //   </Accordion>
        }
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
                    <Nav.Item>
                      <Nav.Link eventKey="addTask">
                        {project.status !== "Completed" &&
                        getCurrentUser()._id === project.leader ? (
                          <div className="d-flex align-items-center">
                            <div className="mr-3">
                              <PlaylistAddTwoToneIcon />
                            </div>
                            <div>Add Task</div>
                          </div>
                        ) : (
                          <div> </div>
                        )}
                      </Nav.Link>
                    </Nav.Item>
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
                    <div className="card-body">testing</div>
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
                          Task dpendency diagram.
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
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

export default ProjectDashboard;
