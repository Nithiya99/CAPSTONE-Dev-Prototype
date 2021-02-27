import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import AddTask from "./taskComponents/AddTask";

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
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Show and Connect Tasks
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>Hello! I'm another body</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default ProjectDashboard;
