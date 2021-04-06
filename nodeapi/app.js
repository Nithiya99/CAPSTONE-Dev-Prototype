const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// "mongodb://localhost/nodeapi"
// process.env.MONGO_URI
mongoose
  .connect("mongodb://localhost/nodeapi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected!!!");
  });

mongoose.connection.on("error", (err) => {
  console.log(`DB Connection error: ${err.message}`);
});

//bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const utilRoutes = require("./routes/utils");
const tasksRoutes = require("./routes/tasks");
const notifRoutes = require("./routes/notifications");
// api docs
app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/", postRoutes);
app.use("/", projectRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", tasksRoutes);
app.use("/", utilRoutes);
app.use("/", notifRoutes);
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthrized!" });
  }
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`A Node JS API is listening on port: ${port}`);
});
