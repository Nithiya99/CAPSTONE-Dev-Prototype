const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignupValidator } = require("../validator");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any route containing: userId, our app will first excute userById()
router.param("userId", userById);

module.exports = router;
