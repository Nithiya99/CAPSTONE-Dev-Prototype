const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const User = require("../models/user");

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  const userNameExists = await User.findOne({ username: req.body.username });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken!",
    });
  if (userNameExists)
    return res.status(403).json({
      error: "Username is taken!",
    });
  const socialObj = {
    website: req.body.website,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    youtube: req.body.youtube,
    linkedin: req.body.linkedin,
    twitter: req.body.twitter,
  };
  req.body.social = socialObj;
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Signup success! Please login!" });
};
// exports.signupProfile = async (req, res) => {
//   console.log(req.params);
// };
exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup.",
      });
    }
    // if user is found, make sure the email and password match
    // create authenticate model and use here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match.",
      });
    }
    // generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return resoonse with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signout Success!" });
};

exports.requireSignin = expressJwt({
  // if the token is valid, express jwt appends the verified users id in
  // an auth key to the request object
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
