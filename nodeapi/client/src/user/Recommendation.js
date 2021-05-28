import React, { Component } from "react";
import { Tab, Nav } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LiveClock from "react-live-clock";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";
import StorageRoundedIcon from "@material-ui/icons/StorageRounded";
import AssignmentIndRoundedIcon from "@material-ui/icons/AssignmentIndRounded";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { DropzoneArea } from "material-ui-dropzone";
import { PdfDropZone } from "./PdfDropZone";
class Recommendation extends Component {
  state = {
    key: "Database",
  };
  componentDidMount() {}
  render() {
    return (
      //   <Tabs
      //     id="controlled-tab-example"
      //     activeKey={this.state.key}
      //     onSelect={(k) => this.setState({ key: k })}
      //   >
      //     <Tab eventKey="Database" title="Database">
      //       <h1>Database</h1>
      //     </Tab>
      //     <Tab eventKey="Resume" title="Resume">
      //       <h1>Resume</h1>
      //     </Tab>
      //   </Tabs>

      <>
        <div
          className="subheader py-2 py-lg-6  subheader-transparent "
          id="kt_subheader"
        >
          <ToastContainer />
          <div className=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <div className="d-flex align-items-center flex-wrap mr-2">
              <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">
                Recommendation
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
            <Tab.Container id="Database" defaultActiveKey="Database">
              <div className="card-header">
                <div className="card-title">
                  <Nav variant="pills">
                    <Nav.Item>
                      <Nav.Link eventKey="Database">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <StorageRoundedIcon />
                          </div>
                          <div>Database</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Resume">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <AssignmentIndRoundedIcon />
                          </div>
                          <div>Resume</div>
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <div className="card-body">
                <Tab.Content>
                  <Tab.Pane eventKey="Database">
                    <div>
                      <Tab.Container
                        id="DatabaseRecommender"
                        defaultActiveKey="ProjectRecommender"
                      >
                        <div>
                          <div className="card-title">
                            <Nav variant="pills">
                              <Nav.Item>
                                <Nav.Link eventKey="ProjectRecommender">
                                  <div className="d-flex align-items-center">
                                    <div className="mr-3">
                                      <LibraryBooksIcon />
                                    </div>
                                    <div>Project Recommender</div>
                                  </div>
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="UserRecommender">
                                  <div className="d-flex align-items-center">
                                    <div className="mr-3">
                                      <PeopleOutlineIcon />
                                    </div>
                                    <div>User Recommender</div>
                                  </div>
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="ProjectChecker">
                                  <div className="d-flex align-items-center">
                                    <div className="mr-3">
                                      <FileCopyIcon />
                                    </div>
                                    <div>Project Checker</div>
                                  </div>
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </div>
                        </div>
                        <div className="card-body">
                          <Tab.Content>
                            <Tab.Pane eventKey="ProjectRecommender">
                              <div className="row row-cols-1 ">
                                Project Recommender
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="UserRecommender">
                              <div className="row row-cols-1 ">
                                User Recommender
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="ProjectChecker">
                              <div className="row row-cols-1 ">
                                Project Checker
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </div>
                      </Tab.Container>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Resume">
                    <div className="text-center">
                      <div>Drop in the resumes here</div>
                      <PdfDropZone />
                    </div>
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
export default Recommendation;
