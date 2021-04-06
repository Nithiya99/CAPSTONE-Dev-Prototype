const express = require("express");
const { requireSignin } = require("../controllers/auth");
const bodyParser = require("body-parser");
const { userById } = require("../controllers/user");
const {
  addNotification,
  getNotifications,
} = require("../controllers/notifications");
const router = express.Router();

router.use(bodyParser.json());

router.put(
  "/notifications/addNotification/:userId",
  requireSignin,
  addNotification
);
router.get("/notifications/:userId", requireSignin, getNotifications);

router.param("userId", userById);

module.exports = router;
