const express = require("express");
const {
  userById,
  allUsers,
  getUser,
  getUserInfo,
  updateUser,
  deleteUser,
  followRequest,
  unfollowRequest,
  setRating,
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser);
router.delete("/user/:userId", requireSignin, deleteUser);
router.get("/userInfo/:userId", getUserInfo);
router.put("/follow/:userId",requireSignin,followRequest);
router.put("/unfollow/:userId",requireSignin,unfollowRequest);
router.put("/user/rating/:userId", requireSignin, setRating);
// any route containing: userId, our app will first excute userById()
router.param("userId", userById);

module.exports = router;
