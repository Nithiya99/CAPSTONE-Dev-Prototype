const express = require("express");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { projectById } = require("../controllers/project");
const { addTasks } = require("../controllers/tasks");
const router = express.Router();

router.put("/project/tasks/:userId/:projectId", requireSignin, addTasks);

//params
router.param("userId", userById);
router.param("projectId", projectById);

module.exports = router;
