const express = require("express");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { projectById } = require("../controllers/project");
const {
  addTasks,
  getTasks,
  getTask,
  updatePredecessors,
  addConnection,
  getAllConnections,
  putPosition,
} = require("../controllers/tasks");
const router = express.Router();

router.put("/project/tasks/:userId/:projectId", requireSignin, addTasks);
router.get("/project/task/:userId/:projectId", requireSignin, getTask);
router.get("/project/tasks/:userId/:projectId", requireSignin, getTasks);
router.put(
  "/project/tasks/predecessors/:userId/:projectId",
  requireSignin,
  updatePredecessors
);
router.put(
  "/project/connections/:userId/:projectId",
  requireSignin,
  addConnection
);
router.get(
  "/project/connections/:userId/:projectId",
  requireSignin,
  getAllConnections
);

router.put("/project/position/:userId/:projectId", requireSignin, putPosition);
//params
router.param("userId", userById);
router.param("projectId", projectById);

module.exports = router;
