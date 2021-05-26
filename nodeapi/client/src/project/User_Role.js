import React, { Component } from "react";
import { getCurrentUser, list } from "../user/apiUser";
const similarity = require("sentence-similarity");
const similarityScore = require("similarity-score");
class User_Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  render() {
    let users = [];
    const role = this.props.role;
    const leader = this.props.leader;
    users = this.state.users;
    let final_out = [];
    let role_skills = role.roleSkills;
    users.sort(function (a, b) {
      return (
        b.projects.length +
        b.completed_projects.length -
        (a.projects.length + a.completed_projects.length)
      );
    });

    let max_proj = 1;
    if (users.length > 0)
      max_proj = users[0].projects.length + users[0].completed_projects.length;
    let winkOpts = {
      f: similarityScore.winklerMetaphone,
      options: { threshold: 0 },
    };
    users.forEach((user) => {
      let out = {};
      let score = similarity(user.skills, role_skills, winkOpts);
      out = user;
      let total_projects =
        user.projects.length + user.completed_projects.length;
      let final_value =
        ((total_projects / max_proj) * user.rating) / 10 +
        score.exact / role_skills.length +
        -0.04 * user.projects.length +
        0.01 * user.completion_percentage_of_all_projects;
      out["exact"] = score.exact;
      out["final_value"] = final_value;
      final_out.push(out);
    });

    final_out = final_out.filter(
      (x) => role.assignedTo !== x._id && x._id !== leader
    );
    final_out.sort(function (a, b) {
      return b.final_value - a.final_value;
    });
    // final_out = final_out.filter((x) => x.exact != 0);
    final_out = final_out.slice(0, 5);
    console.log("role:", role.roleName, "users:", final_out);
    return <div></div>;
  }
}

export default User_Role;
