const _ = require("lodash");
const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user; // Adds profile object in req with user info
    next();
  });
};
function getUserById(id) {
  User.findOne({ _id: id }, (err, res) => {
    if (err) return "User Not Found";
    return res;
  });
}

exports.getUserInfo = (req, res) => {
  let user = req.profile;
  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(200).json({ err: "Could not fetch user" });
  }
};
exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    return res
      .status(403)
      .json({ error: "User is not authorized to perform this action." });
  }
};

exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(users);
  }).select(
    "name email updated created username bio social location skills dob projects completed_projects rating completion_percentage_of_all_projects"
  );
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body); //extend - mutates the source object
  user.updated = Date.now();
  user.save((err) => {
    if (err) {
      return res
        .status(400)
        .json({ err: "You are not authorized to perform this action" });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user });
  });
};

exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ message: "User deleted successfully!" });
  });
};
exports.setRating = (req, res) => {
  let user = req.profile;
  let rating = req.body.rating;
  console.log("Before:");
  console.log(user.ratings, user.rating, rating);
  console.log("On Process:");
  Object.keys(rating).map((key) => {
    User.findById(key, (err, userObj) => {
      // console.log(userObj.ratings, userObj.rating);
      userObj.ratings.push(rating[key]);
      let sum = 0;
      userObj.ratings.map((rat) => {
        sum += rat;
      });
      userObj.rating = sum / userObj.ratings.length;
      console.log(`after(${userObj.name}):`);
      console.log(userObj.ratings, userObj.rating);
      userObj.save((err) => {
        if (err) res.status(400).json({ err });
      });
    });
  });
  return res.status(200).json({ message: "Updated Ratings" });
};
