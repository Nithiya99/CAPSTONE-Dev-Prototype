const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const webp = require("webp-converter");
const sharp = require("sharp");
const multer = require("multer");
const path = require("path");
webp.grant_permission();

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .populate("liked_by", "_id")
    .populate("comments")
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
    .select(
      "_id photo video postType title liked_by comments tags metadataAuthor metadataTitle project"
    )
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};
exports.postVideo = (req, res) => {
  const cloudinaryVideo = require("cloudinary").v2;
  cloudinaryVideo.config({
    cloud_name: "workshake-video-trial",
    api_key: "436795657912165",
    api_secret: "txbBMuRIGHQbmTYulTp7lXhHecA",
  });
  console.log(req.file);
  console.log(req.body);
  let file = req.file;
  let path = file.destination + file.filename;
  cloudinaryVideo.uploader.upload(
    path,
    {
      resource_type: "video",
      chunk_size: 6000000,
    },
    (err, result) => {
      if (err) {
        console.log("error:", err);
        return res.status(400).json({ err });
      }
      console.log("result:", result);
      fs.unlink(path, function (err) {
        if (err && err.code == "ENOENT") {
          // file doens't exist
          console.info("File doesn't exist, won't remove it.");
        } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          console.error("Error occurred while trying to remove file");
        } else {
          console.info(`removed`);
        }
      });
      return res.status(200).json({ result });
    }
  );
};
exports.videoPostMongo = (req, res) => {
  // console.log(req.body);
  const { video, title, tags, project } = req.body;
  let user = req.profile;
  if (!video) {
    return res
      .status(403)
      .json({ error: "add suitable video to add to server" });
  }
  const post =
    project !== undefined
      ? new Post({
          video: video,
          postedBy: user._id,
          title: title,
          tags: tags,
          project,
          postType: "video",
        })
      : new Post({
          video: video,
          postedBy: user._id,
          title: title,
          tags: tags,
          postType: "video",
        });
  post
    .save()
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(402).json({ error: "could not save" });
    });
};
exports.createPost = (req, res) => {
  const { pic, title, tags, project } = req.body;
  let user = req.profile;
  if (!pic) {
    return res
      .status(403)
      .json({ error: "add suitable photo to add to server" });
  }
  console.log(project);

  const post =
    project !== undefined
      ? new Post({
          photo: pic,
          postedBy: user._id,
          title: title,
          tags: tags,
          project,
          postType: "image",
        })
      : new Post({
          photo: pic,
          postedBy: user._id,
          title: title,
          tags: tags,
          postType: "image",
        });
  // console.log(project);
  post
    .save()
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(402).json({ error: "could not save" });
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
  let type = post.postType;
  console.log(post);
  let cloudinary_id = "";
  if (type === "image") {
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: "workshaketrial",
      api_key: "141328859214936",
      api_secret: "ped5_kvwuwzIV2YJxxkFkDKmKHw",
    });

    let photo_url = post.photo;
    photo_url.map((url) => {
      url = url.split("/");
      let str = url[url.length - 1];
      str = str.split(".")[0];
      cloudinary_id = str.toString();
      console.log(cloudinary_id);
      cloudinary.uploader.destroy(cloudinary_id, function (error, result) {
        console.log(result, error);
      });
    });
  }
  if (type === "video") {
    const cloudinaryVideo = require("cloudinary").v2;
    cloudinaryVideo.config({
      cloud_name: "workshake-video-trial",
      api_key: "436795657912165",
      api_secret: "txbBMuRIGHQbmTYulTp7lXhHecA",
    });

    let url = post.video;
    url = url.split("/");
    let str = url[url.length - 1];
    str = str.split(".")[0];
    cloudinary_id = str.toString();
    console.log(cloudinary_id);
    cloudinaryVideo.uploader.destroy(
      cloudinary_id,
      { resource_type: "video" },
      function (error, result) {
        console.log(result, error);
      }
    );
  }
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
exports.convertToWebp = (req, res) => {
  const cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: "workshaketrial",
    api_key: "141328859214936",
    api_secret: "ped5_kvwuwzIV2YJxxkFkDKmKHw",
  });
  console.log("file: ", req.file);
  // upload(req, res, (err) => {
  //   console.log("Request ---", req.body);
  //   console.log("Request file ---", req.file); //Here you get file.
  //   /*Now do where ever you want to do*/
  //   // if (!err) return res.send(200).end();
  // });
  let file = req.file;
  // console.log(req.file);
  console.log("path:", file.destination + file.filename);
  sharp(file.destination + file.filename)
    .resize(1000, 1000)
    .webp()
    .toFile(file.destination + file.filename + " edited.webp", (err, info) => {
      if (err) console.log(err);
      else {
        console.log(info);
        cloudinary.uploader.upload(
          file.destination + file.filename + " edited.webp",
          (err, result) => {
            if (err) {
              console.log("error:", err);
              return res.status(400).json({ err });
            }
            console.log("result:", result);
            fs.unlink(
              file.destination + file.filename + " edited.webp",
              function (err) {
                if (err && err.code == "ENOENT") {
                  // file doens't exist
                  console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                  // other errors, e.g. maybe we don't have enough permission
                  console.error("Error occurred while trying to remove file");
                } else {
                  console.info(`removed`);
                }
              }
            );
            fs.unlink(file.destination + file.filename, function (err) {
              if (err && err.code == "ENOENT") {
                // file doens't exist
                console.info("File doesn't exist, won't remove it.");
              } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.error("Error occurred while trying to remove file");
              } else {
                console.info(`removed`);
              }
            });

            return res.status(200).json({ result });
          }
        );
        // fs.unlink(file.destination + file.filename);
        // fs.unlink(file.destination + file.filename + " edited.webp");
      }
    });

  // console.log(req.body.title);
  // console.log(req.body.tags);
  // let data = req.body.baseData;
  // console.log("base64data:", req.body);
  // const data = req.body.data;
  // // console.log("data:", data);
  // let type = data.match(/[^:/]\w+(?=;|,)/)[0];
  // // console.log("type:", type);
  // var imageBuffer = decodeBase64Image(data);
  // // console.log(imageBuffer);
  // let name = Date.now();

  // sharp(imageBuffer.data)
  //   .resize(500, 500)
  //   .toFile(`./uploads/${name}.webp`, (err, info) => {
  //     if (err) console.log(err);
  //     else {
  //       console.log(info);
  //       // fs.readFile(`./uploads/${name}.webp`, (err, data) => {
  //       //   console.log(data);
  //       // });
  // cloudinary.uploader.upload(`./uploads/${name}.webp`, (err, result) => {
  //   if (err) {
  //     console.log("error:", err);
  //     return res.status(400).json({ err });
  //   }
  //   console.log("result:", result);
  //   return res.status(200).json({ result });
  // });
  //     }
  //   });
};
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

exports.likePost = (req, res) => {
  Post.findById(req.body.postId).exec((err, post) => {
    if (err || !post) {
      return res.status(400).json({
        error: err,
      });
    }
    post.liked_by.push(req.body.userId);
    post.save();
    res.status(200).json({ message: "Post liked" });
  });
};

exports.dislikePost = (req, res) => {
  Post.findById(req.body.postId).exec((err, post) => {
    if (err || !post) {
      return res.status(400).json({
        error: err,
      });
    }
    post.liked_by.pull(req.body.userId);
    post.save();
    res.status(200).json({ message: "Post Disliked" });
  });
};

exports.addcomment = (req, res) => {
  Post.findById(req.body.postId).exec((err, post) => {
    if (err || !post) {
      return res.status(400).json({
        error: err,
      });
    }
    let comment = {
      comment: req.body.comment,
      userId: req.body.userId,
      userName: req.body.userName,
    };
    post.comments.push(comment);
    post.save();
    res.status(200).json({ message: "New Comment posted" });
  });
};

exports.getPost = (req, res) => {
  Post.findById(req.post._id)
    .populate("postedBy", "_id name")
    .select("_id photo title likes liked_by comments postType tags video ")
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => console.log(err));
};

exports.createTextPost = (req, res) => {
  console.log(req.body.text);
  let user = req.profile;
  const post = new Post({
    title: req.body.text,
    postType: "text",
    postedBy: user._id,
  });
  post
    .save()
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(402).json({ error: "could not save" });
    });
};
exports.createYoutubePost = (req, res) => {
  console.log(req.body);
  let user = req.profile;

  const post = new Post({
    video: req.body.videolink,
    title: req.body.title,
    postType: "youtubeVideo",
    metadataTitle: req.body.metadataTitle,
    metadataAuthor: req.body.metadataAuthor,
    postedBy: user._id,
  });
  post
    .save()
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(402).json({ error: "could not save" });
    });
};

exports.getLikesOfPost = (req, res) => {
  // console.log(req.post.liked_by);
  // console.log(req.post.liked_by);
  if (req.post) {
    return res.status(200).json({ liked_by: req.post.liked_by });
  }
  return res.status(400).json({ error: "not found" });
};
exports.getCommentsOfPost = (req, res) => {
  // console.log(req.post.liked_by);
  if (req.post) {
    return res.status(200).json({ comments: req.post.comments });
  }
  return res.status(400).json({ error: "not found" });
};

exports.editPost = (req, res) => {
  console.log(req.body);
  Post.findById(req.body.postId).exec((err, post) => {
    if (err || !post) {
      return res.status(400).json({
        error: err,
      });
    }
    post.title = req.body.title;
    post.save();
    res.status(200).json({ message: "Post updated" });
  });
};

exports.deleteComment = (req, res) => {
  Post.findById(req.body.postId).exec((err, post) => {
    if (err || !post) {
      return res.status(400).json({
        error: err,
      });
    }
    post.comments.pull(req.body.commentId);
    post.save();
    res.status(200).json({ message: "Comment Deleted" });
  });
};
