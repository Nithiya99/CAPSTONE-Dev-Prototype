const express = require("express");
const {
  createProject,
  allProjects,
  projectById,
  requestRole,
  roleById,
  acceptRequest,
  declineRequest,
  getRequests,
  getRoles,
} = require("../controllers/project");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();

router.get("/projects", allProjects);
router.post("/project/new/:userId", requireSignin, createProject);
router.put("/project/request/:userId/:projectId", requireSignin, requestRole);
router.get("/roles/:projectId", requireSignin, getRoles);
router.get("/requests/:projectId", requireSignin, getRequests);
router.put("/requests/accept/:userId/:projectId", requireSignin, acceptRequest);
router.put(
  "/requests/decline/:userId/:projectId",
  requireSignin,
  declineRequest
);

// any route containing: userId, our app will first excute userById()
router.param("userId", userById);
router.param("projectId", projectById);

module.exports = router;
