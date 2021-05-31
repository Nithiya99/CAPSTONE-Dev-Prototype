import React, { Component } from "react";
import { getCurrentUser, getUserById } from "./../user/apiUser";
import { listprojects } from "./../project/apiProject";
import { Link } from "react-router-dom";
import JoinProject from "./../project/JoinProject";

const similarity = require("sentence-similarity");
const similarityScore = require("similarity-score");

class RecommendationProject2 extends Component {
  constructor() {
    super();
    this.state = {
      skills: [],
      projects: [],
    };
  }

  async componentDidMount() {
    listprojects().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ projects: data });
      }
    });
    const { skills } = this.props;
    this.setState({ skills });
  }

  componentDidUpdate() {
    const { skills } = this.props;
    if (skills.length !== this.state.skills.length) this.setState({ skills });
  }

  renderProjects = (final_out) => (
    <div className="row row-cols-1 row-cols-md-1">
      {final_out.map((project, i) => (
        <div className="col">
          <div className="card card-custom gutter-b card-stretch" key={i}>
            <div className="card-body text-center pt-4">
              <div className="my-4">
                <h5 className="text-dark font-weight-bold font-size-h3">
                  {project.title}
                </h5>
              </div>
              <div className="text-dark font-weight-bold font-size-h6">
                {project.description}
              </div>
              <div className="lead">
                {project.skills.map((skill) => (
                  <span class="btn btn-light-info btn-sm font-weight-bold btn-upper btn-text m-2">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-9">
                <Link
                  to={`/joinProject/`}
                  className="btn btn-light-primary font-weight-bolder btn-sm py-3 px-6 text-uppercase"
                >
                  view project
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { skills, projects } = this.state;

    if (skills === undefined) return null;
    //if(skills.length === 0)
    //    return (<div>Enter your skill :)</div>)
    console.log(skills);
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
            {this.renderProjects(final_out)}
          </>
        )}
      </div>
    );
  }
}

export default RecommendationProject2;
