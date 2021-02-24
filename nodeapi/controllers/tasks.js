exports.putTasks = (req, res) => {
  if (req.profile._id.toString() === req.projectObject.leader.toString()) {
    // console.log(req.body);
    // console.log(req.profile);
    // console.log(req.projectObject);

    const project = req.projectObject;
    const tasks = req.body;
    project.tasks = tasks;
    project.save((err) => {
      if (err) res.status(400).json({ err });
      else res.status(200).json({ project });
    });
  } else {
    res.status(400).json({ message: "Not Leader" });
  }
};
