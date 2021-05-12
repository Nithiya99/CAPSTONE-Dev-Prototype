const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const webp = require("webp-converter");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
webp.grant_permission();
cloudinary.config({
  cloud_name: "workshaketrial",
  api_key: "141328859214936",
  api_secret: "ped5_kvwuwzIV2YJxxkFkDKmKHw",
});
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
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer.from(matches[2], "base64");

  return response;
}
exports.convertToWebp = async (req, res) => {
  // let data = req.body.baseData;
  // console.log("base64data:", req.body);
  const data = req.body.data;
  // console.log("data:", data);
  let type = data.match(/[^:/]\w+(?=;|,)/)[0];
  // console.log("type:", type);
  var imageBuffer = decodeBase64Image(data);
  // console.log(imageBuffer);
  let name = Date.now();
  sharp(imageBuffer.data)
    .resize(500, 500)
    .toFile(`./uploads/${name}.webp`, (err, info) => {
      if (err) console.log(err);
      else {
        console.log(info);
        // fs.readFile(`./uploads/${name}.webp`, (err, data) => {
        //   console.log(data);
        // });
        cloudinary.uploader.upload(`./uploads/${name}.webp`, (err, result) => {
          if (err) {
            console.log("error:", err);
            return res.status(400).json({ err });
          }
          console.log("result:", result);
          return res.status(200).json({ result });
        });
      }
    });
  // let buf = Buffer.from(data);
  // let dataBase64 = Buffer.from(buf).toString("base64");
  // base64str of image
  // base64str image type jpg,png ...
  //option: options and quality,it should be given between 0 to 100
  // console.log(__dirname);
  // fs.writeFile("../temp/", "tempFile." + type, () => {
  //   console.log("created at", __dirname, __filename);
  // });
  // let result = webp.str2webpstr(dataBase64, type, "-q 80");
  // result.then(function (result) {
  //   // you access the value from the promise here
  //   console.log(result);
  // });
  // console.log(result);
  // return res.status(200).json({ msg: "done" });
};
