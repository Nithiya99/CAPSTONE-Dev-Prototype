const express = require("express");
const {
  getPosts,
  createPost,
  postsByUser,
  postById,
  isPoster,
  updatePost,
  deletePost,
  convertToWebp,
} = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

const router = express.Router();

router.get("/posts", getPosts);
router.post("/post/new/:userId", requireSignin, createPost);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.post("/convertToWebp", convertToWebp);
// any route containing: userId, our app will first excute userById()
router.param("userId", userById);
// any route containing: postId, our app will first excute postById()
router.param("postId", postById);

module.exports = router;
