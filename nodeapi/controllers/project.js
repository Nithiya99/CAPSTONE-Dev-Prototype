const { isBuffer } = require("lodash");
const Project = require("../models/project");

exports.createProject = (req, res) => {
  // console.log(req);
  const project = new Project(req.body);
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  project.leader = req.profile;
  project.team.push(req.profile._id);
  console.log(project);
  project.save((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json(result);
  });
};
// exports.updateProject = (req, res) => {
//   const editedProject = new Project(req.body);
//   req.profile.hashed_password = undefined;
//   req.profile.salt = undefined;
//   let project = req.projectObject;
//   project.title = editedProject.title;
//   project.description = editedProject.description;
//   project.roles.map((role, index) => {
//     if (roles[index].roleSkills != editedProject.roles[index].roleSkills) {
//       roles[index].roleSkills = editedProject.roles[index].roleSkills;
//     }
//     if (roles[index].roleName != editedProject.roles[index].roleName) {
//       roles[index].roleName = editedProject.roles[index].roleName;
//     }
//   });
//   console.log(project);
// project.save((err) => {
//   if (err) {
//     return res.status(400).json({ err });
//   }
//   return res.status(200).json({ message: "project updated" });
// });
// };
function isRoleSame(role, newRole) {
  if (
    role.roleName.toString() !== newRole.roleName.toString() ||
    role.roleSkills !== newRole.roleSkills
  ) {
    return false;
  }
  return true;
}
exports.updateProject = (req, res) => {
  let editedProject = req.body;
  let project = req.projectObject;
  project.title = editedProject.title;
  project.description = editedProject.description;
  let editedRoleProject = new Project(editedProject);
  project.roles.map((role, index) => {
    if (isRoleSame(project.roles[index], editedRoleProject.roles[index])) {
      project.roles[index].roleName = editedRoleProject.roles[index].roleName;
      project.roles[index].roleSkills =
        editedRoleProject.roles[index].roleSkills;
    }
  });
  if (editedRoleProject.roles.length > project.roles.length) {
    let index = editedRoleProject.roles.length - project.roles.length + 1;
    while (index < editedRoleProject.roles.length) {
      project.roles.push(editedRoleProject.roles[index++]);
    }
  }
  project.save((err) => {
    if (err) {
      return res.status(400).json({ err });
    }
    return res.status(200).json({ message: "project updated" });
  });
};
exports.deleteProject = (req, res) => {
  let project = req.projectObject;
  try {
    project.remove();
    res.status(200).json({ message: "Deleted project" });
  } catch (err) {
    res.status(400).json({ err });
  }
};
exports.allProjects = (req, res) => {
  Project.find((err, projects) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(projects);
  });
};

exports.projectById = (req, res, next, id) => {
  Project.findById(id).exec((err, project) => {
    if (err || !project) {
      return res.status(400).json({
        error: "Project not found",
      });
    }
    req.projectObject = project; // Adds project object in req with project info
    next();
  });
};

function userIsPresent(requestBy, userId) {
  for (let i = 0; i < requestBy.length; i++) {
    if (userId.toString() === requestBy[i].toString()) {
      return true;
    }
  }
  return false;
}
exports.getRoles = (req, res) => {
  let project = req.projectObject;
  return res.status(200).json({
    roles: project.roles,
  });
};
exports.acceptRequest = (req, res) => {
  let project = req.projectObject;
  let leader = req.profile._id;
  let acceptId = req.body.acceptUserId;
  let roleId = req.body.roleId;
  project.roles.map((role) => {
    if (leader.toString() === project.leader.toString()) {
      if (userIsPresent(role.requestBy, acceptId)) {
        if (roleId.toString() === role._id.toString()) {
          role.assignedTo = acceptId;
          role.requestBy = [];
          project.team.push(acceptId);
          project.save((err) => {
            if (err) res.status(400).json({ err });
          });
          res.status(200).json({ role });
        }
      } else {
        res.status(400).json({
          err: "User has not requested",
        });
      }
    } else {
      res.status(400).json({
        err: "Not Authorized to Perform this action",
      });
    }
  });
};
function removeRequest(requestBy, value) {
  var index = requestBy.indexOf(value);
  if (index > -1) {
    requestBy.splice(index, 1);
  }
  return requestBy;
}

exports.declineRequest = (req, res) => {
  let project = req.projectObject;
  let leader = req.profile._id;
  let rejectId = req.body.rejectUserId;
  let roleId = req.body.roleId;
  project.roles.map((role) => {
    if (leader.toString() === project.leader.toString()) {
      if (userIsPresent(role.requestBy, rejectId)) {
        if (roleId.toString() === role._id.toString()) {
          removeRequest(role.requestBy, rejectId);
          project.save((err) => {
            if (err) res.status(400).json({ err });
          });
          res.status(200).json({ role });
        }
      } else {
        res.status(400).json({
          err: "User has not requested",
        });
      }
    } else {
      res.status(400).json({
        err: "Not Authorized to Perform this action",
      });
    }
  });
};

exports.getRequests = (req, res) => {
  let project = req.projectObject;
  let requests = [];
  project.roles.map((role) => {
    let tempObj = {
      roleId: role._id,
      roleName: role.roleName,
      requests: role.requestBy,
    };
    requests.push(tempObj);
  });
  res.status(200).json({
    requests,
  });
};
exports.getProjectsOfUser = (req, res) => {
  let user = req.profile;
  // console.log(user);
  Project.find((err, projects) => {
    if (err) {
      res.status(400).json({ err });
    }
    let userProjects = [];
    projects.map((project) => {
      if (project.team.includes(user._id)) {
        userProjects.push(project);
      }
    });
    res.status(200).json({ userProjects });
  });
};
exports.requestRole = (req, res, next) => {
  let project = req.projectObject;
  let roleId = req.body.roleId;
  let user = req.profile._id;
  project.roles.map((role) => {
    if (roleId == role._id) {
      if (userIsPresent(role.requestBy, user)) {
        return res.status(400).json({ err: "User already requested" });
      } else {
        role.requestBy.unshift(user);
        // res.status(200).json({ message: "User requested" });
        try {
          project.save();
          res.status(200).json({ message: "User requested" });
        } catch (err) {
          console.log("Not saved");
          return res.status(400).json({ err: "Not saved" });
        }
      }
    }
  });
};
