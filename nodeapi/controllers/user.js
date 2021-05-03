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
    "name email updated created username bio social location skills dob projects completed_projects rating completion_percentage_of_all_projects followers following"
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

exports.followRequest = (req, res) => {
  let user = req.profile;
  console.log(user);
  user.following.push(req.body.followId);
  user.save();
  User.findById(req.body.followId, (err, result) => {
    result.followers.push(user._id);
    result.save();
  });
  return res.status(200).json({ user });
};

exports.unfollowRequest = (req, res) => {
  let user = req.profile;
  user.following.pull(req.body.followId);
  user.save();
  User.findById(req.body.followId, (err, result) => {
    result.followers.pull(user._id);
    result.save();
  });
  return res.status(200).json({ user });
};

exports.getfollowers = (req, res) => {
  let user = req.profile;
  User.findById(user._id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    return res.json(user.followers);
  });
};

exports.getfollowing = (req, res) => {
  let user = req.profile;
  User.findById(user._id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    return res.json(user.following);
  });
};

exports.getfriends = (req, res) => {
  let user = req.profile;
  User.findById(user._id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    let final = user.following.filter((value) =>
      user.followers.includes(value)
    );
    return res.json(final);
  });
};

exports.updatePersonalChat = (req, res) => {
  let chat_msg = req.body.chat;
  console.log(chat_msg);
  User.findById(req.body.chat.touser_id).exec((err, user) => {
    if (err || !user)
      console.log("user not found");
    else
    {
      user.chat.push(chat_msg);
      user.save();
    }
  });
  User.findById(req.body.chat.fromuser).exec((err, user) => {
    if (err || !user)
      console.log("user not found");
    else{
      user.chat.push(chat_msg);
      user.save();
    }
  });
  return res.status(200).json("personal chat updated");
};

exports.getPersonalChat = async (id) => {
  const { chat } = await User.findById(id).exec();
  return chat;
};
