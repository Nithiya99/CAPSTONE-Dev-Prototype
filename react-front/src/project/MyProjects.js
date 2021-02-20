import React, { Component } from "react";
import { listmyprojects } from "./apiProject";
import { Tab, Tabs, TabContent, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getCurrentUser } from "./../user/apiUser";
import RoleReq from "./RoleReq";
import AssignedTo from "./AssignedTo";
import DeleteProject from "./DeleteProject";
class MyProjects extends Component {
  state = {
    myProjects: [],
    currentProject: {},
    user: {},
  };
  componentDidMount() {
    listmyprojects().then((data) => this.setState({ myProjects: data }));
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
    return (
      <div className="mt-5">
        <h2>My Projects</h2>
        <Tabs fill defaultActiveKey="home" id="uncontrolled-tab-example">
          {myProjects.userProjects.map((project) => (
            <Tab
              eventKey={project.title}
              title={project.title}
              mountOnEnter
              unmountOnExit={false}
            >
              <TabContent className="mt-3">
                <h3>{project.title}</h3>
                <p>
                  <strong>Description: </strong> {project.description}
                </p>
                <p>
                  <strong>Skills: </strong>
                  {project.skills}
                </p>
                <table className="table">
                  <thead>
                    <tr key={"title"}>
                      <th key={"rolename"}>Role Name</th>
                      <th key={"skills"}>Skills Required</th>

                      <th key={"assigned"}>Assigned To</th>
                    </tr>
                    {project.roles.map((role) => (
                      <tr key={role._id.toString()}>
                        <td
                          key={role._id.toString() + role.roleName.toString()}
                        >
                          {role.roleName}
                        </td>
                        <td
                          key={role._id.toString() + role.roleSkills.toString()}
                        >
                          {role.roleSkills + ","}
                        </td>
                        {project.leader === getCurrentUser()._id &&
                        role.assignedTo === undefined ? (
                          <>
                            <RoleReq
                              requestBy={role.requestBy}
                              projectId={project._id}
                              roleId={role._id}
                            />
                          </>
                        ) : (
                          <>
                            <AssignedTo id={role.assignedTo} />
                          </>
                        )}
                      </tr>
                    ))}
                  </thead>
                </table>
                {getCurrentUser()._id === project.leader ? (
                  <>
                    <Button variant="outline-warning">Edit Project</Button>
                    <DeleteProject projectId={project._id} />
                  </>
                ) : (
                  <></>
                )}

                <Link
                  className="btn btn-info"
                  to={{
                    pathname: `/myprojects/dashboard/${project._id}`,
                    state: { project: project },
                  }}
                >
                  Project Dashboard
                </Link>
              </TabContent>
            </Tab>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default MyProjects;
