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
  likePost,
  dislikePost,
  addcomment,
  getPost,
} = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).single("myImage");
router.get("/posts", getPosts);
router.post("/post/new/:userId", requireSignin, createPost);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.post("/convertToWebp", upload, convertToWebp);
router.put("/post/like/:postId", requireSignin, likePost);
router.put("/post/dislike/:postId", requireSignin, dislikePost);
router.put("/post/addcomment/:postId", requireSignin, addcomment);
router.get("/post/:postId", getPost);

// any route containing: userId, our app will first excute userById()
router.param("userId", userById);
// any route containing: postId, our app will first excute postById()
router.param("postId", postById);

module.exports = router;
