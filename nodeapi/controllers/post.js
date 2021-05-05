const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      req.post = post;
      next();
    });
};

exports.getPosts = (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name")
    .select("_id photo")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

exports.createPost = (req, res) => {
  const { pic } = req.body;
  let user = req.profile;
  if (!pic) {
    return res
      .status(403)
      .json({ error: "add suitable photo to add to server" });
  }
  const post = new Post({
    photo: pic,
    postedBy: user._id,
  });
  post
    .save()
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(402).json({ err: "could not save" });
    });
};

exports.postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  // console.log("req.post: ", req.post);
  // console.log("req.auth: ", req.auth);
  // console.log("req.post.postedBy._id: ", req.post.postedBy._id);
  console.log("req.auth.id: ", req.auth.id);
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized!",
    });
  }
  next();
};

exports.updatePost = (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  post.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(post);
  });
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "Post deleted successfully",
    });
  });
};
