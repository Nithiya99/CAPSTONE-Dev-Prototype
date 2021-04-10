import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import AddTask from "./taskComponents/AddTask";
import MyTasks from "./taskComponents/MyTask";
import LayoutComponent from "./layout/LayoutComponent";
import TrelloTask from "./taskComponents/TrelloTask";
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
      <div className="mt-5">
        <h1>{project.title}'s Dasboard</h1>
        <Accordion defaultActiveKey="0">
          {project.status === "Completed" ? (
            <> </>
          ) : (
            <>
              {getCurrentUser()._id === project.leader ? (
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Add Task
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <AddTask projectId={project._id} />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ) : (
                <> </>
              )}
            </>
          )}
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Show Tasks
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <MyTasks projectId={project._id} status={project.status} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                Connect Tasks with Graphic layout
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <LayoutComponent project={project} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="3">
                Trello
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                <TrelloTask projectId={project._id} status={project.status} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default ProjectDashboard;
