import React, { Component } from "react";
import { listprojects, request } from "./apiProject";
import { getCurrentUser } from "../user/apiUser";
import { connect } from "react-redux";
import { notificationAdded } from "../store/notifications";
import { toast } from "react-toastify";
import LiveClock from "react-live-clock";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";
import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
class JoinProject extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    listprojects().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ projects: data });
      }
    });
  }

  render() {
    const { projects } = this.state;

    return (
      <>
        <div
          className="subheader py-2 py-lg-6  subheader-transparent "
          id="kt_subheader"
        >
          <div className=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <div className="d-flex align-items-center flex-wrap mr-2">
              <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">
                Join Project
              </h5>
              <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
              <span>
                <div
                  className="quick-search quick-search-inline ml-4 w-250px"
                  id="kt_quick_search_inline"
                >
                  <form className="quick-search-form">
                    <div className="input-group rounded">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <SearchTwoToneIcon />
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control h-40px"
                        placeholder="Search..."
                      />
                    </div>
                  </form>
                </div>
              </span>
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
        <div className="d-flex flex-column-fluid">
          <div className="container">
            {projects.map((project, i) => (
              <div className="card card-custom gutter-b">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div className="mr-3">
                          <p className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">
                            {project.title}
                          </p>
                          <div className="d-flex flex-wrap my-2">
                            <p className="text-muted font-weight-bold mr-lg-8 mr-5 mb-lg-0 mb-2">
                              {project.leader} [Load username]
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center flex-wrap justify-content-between">
                        <div className="flex-grow-1 font-weight-bold text-dark-100 py-5 py-lg-2 mr-5">
                          {project.description}
                          <p className="card-text">
                            <strong>Skills required: </strong>
                            {project.skills}
                          </p>
                        </div>

                        <div className="d-flex flex-wrap align-items-center py-2">
                          <div className="d-flex align-items-center mr-10">
                            <div className="mr-12 d-flex flex-column mb-7">
                              <span className="d-block font-weight-bold mb-4">
                                Start Date
                              </span>
                              <span className="btn btn-sm btn-text btn-light-primary text-uppercase font-weight-bold">
                                [Load]
                              </span>
                            </div>
                            <div className="mr-12 d-flex flex-column mb-7">
                              <span className="d-block font-weight-bold mb-4">
                                Due Date
                              </span>
                              <span className="btn btn-sm btn-text btn-light-danger text-uppercase font-weight-bold">
                                [Load]
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1 flex-shrink-0 w-150px w-xl-300px mt-4 mt-sm-0">
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
                      </div>
                    </div>
                  </div>
                  <div className="separator separator-solid my-7"></div>
                  <table className="table">
                    <thead>
                      <tr key={"title"}>
                        <th key={"rolename"}>Role Name</th>
                        <th key={"skills"}>Skills Required</th>
                        <th key={"status"}>Status</th>
                      </tr>
                      {project.roles.map((role) => (
                        <tr key={role._id.toString()}>
                          <td
                            key={role._id.toString() + role.roleName.toString()}
                          >
                            {role.roleName}
                          </td>
                          <td
                            key={
                              role._id.toString() + role.roleSkills.toString()
                            }
                          >
                            {role.roleSkills + ","}
                          </td>
                          <td>
                            {role.assignedTo !== undefined ? (
                              <Badge pill variant="warning">
                                Position Full
                              </Badge>
                            ) : (
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                  getCurrentUser()._id === project.leader
                                    ? toast("Leaders cant Request, right???")
                                    : request(
                                        getCurrentUser()._id,
                                        project._id,
                                        role._id
                                      ).then((val) => {
                                        if (!val.err) {
                                          this.props.notificationAdded({
                                            userId: project.leader,
                                            message: `${
                                              role.roleName
                                            } requested by ${
                                              getCurrentUser().name
                                            }!`,
                                            type: "RequestForRole",
                                            projectId: project._id,
                                          });
                                        }
                                      });
                                }}
                              >
                                Request
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </thead>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.notifications.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  notificationAdded: (params) => dispatch(notificationAdded(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinProject);
