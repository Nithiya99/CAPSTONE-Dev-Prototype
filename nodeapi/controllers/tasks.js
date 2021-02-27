const Project = require("../models/project");
exports.addTasks = (req, res) => {
  if (req.profile._id.toString() === req.projectObject.leader.toString()) {
    const project = req.projectObject;
    const tasks = req.body;
    project.tasks.push(tasks);
    // console.log(project);
    // project.tasks = tasks;
    project.save((err) => {
      if (err) res.status(400).json({ err });
      else res.status(200).json({ project });
    });
  } else {
    res.status(400).json({ message: "Not Leader" });
  }
};
