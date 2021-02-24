const express = require("express");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { projectById } = require("../controllers/project");
const { putTasks } = require("../controllers/tasks");
const router = express.Router();

router.put("/project/tasks/:userId/:projectId", requireSignin, putTasks);

//params
router.param("userId", userById);
router.param("projectId", projectById);

module.exports = router;
