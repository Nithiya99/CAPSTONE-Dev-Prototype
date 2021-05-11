import React, { Component } from "react";
import { getCurrentUser, getUserById } from "./../user/apiUser";
import { listprojects } from "./../project/apiProject";
import { Link } from "react-router-dom";
import JoinProject from "./../project/JoinProject";

const similarity = require("sentence-similarity");
const similarityScore = require("similarity-score");

class ProjectRecommendation extends Component {
  constructor() {
    super();
    this.state = {
      skills: [],
      user_projects: [],
      projects: [],
    };
  }

  async componentDidMount() {
    var userid = await getCurrentUser()._id;
    // console.log(userid);

    var user_obj = await getUserById(userid);
    this.setState({
      skills: user_obj.user.skills,
      user_projects: user_obj.user.projects,
    });

    listprojects().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ projects: data });
      }
    });
  }

  renderUsers = (final_out) => (
    <div className="row row-cols-1 row-cols-md-1">
      {final_out.map((project, i) => (
        <div className="col">
          <div className="card mb-4" key={i}>
            <div className="card-body">
              <h5 className="card-title">{project.title}</h5>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-weight-bold mr-2">Description: </span>
                <span className="text-muted email-wrap text-hover-primary">
                  {project.description}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-weight-bold mr-2">Skills Required: </span>
                <span className="text-muted email-wrap text-hover-primary">
                  {project.skills.join(", ")}
                </span>
              </div>
              <Link
                to={`/joinProject/`}
                className="btn btn-raised btn-small btn-primary"
              >
                View Project
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { skills, projects, user_projects } = this.state;

    // console.log(skills);
    // console.log(projects);

    let final_out = [];
    let winkOpts = {
      f: similarityScore.winklerMetaphone,
      options: { threshold: 0 },
    };
    projects.forEach((project) => {
      var out = {};
      var score = similarity(skills, project.skills, winkOpts);
      // console.log(score)
      // console.log(project.skills,skills);
      out = project;
      out["exact"] = score.exact;
      // console.log(out);
      final_out.push(out);
    });
    final_out = final_out.filter((x) => !user_projects.includes(x._id));
    final_out = final_out.filter((x) => x.completion_percentage != 100);
    final_out.sort(function (a, b) {
      return b.exact - a.exact;
    });
    // final_out = final_out.filter(x => x.exact !=0);
    final_out = final_out.slice(0, 5);
    // console.log(final_out);

    return (
      <div className="container">
        {final_out.length === 0 ? (
          <></>
        ) : (
          <>
            <h4 className="mt-5 mb-5"> Recommended Projects for You ...</h4>
            {this.renderUsers(final_out)}
          </>
        )}
      </div>
    );
  }
}

export default ProjectRecommendation;
