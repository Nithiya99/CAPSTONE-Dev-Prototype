const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  photo: {
    type: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  liked_by: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  project: {
    type: ObjectId,
    ref: "Project",
  },
  tags: [String],
  comments: [
    {
      comment: {
        type: String,
      },
      userId: {
        type: ObjectId,
        ref: "User",
      },
      PostedOn: {
        type: Date,
        default: Date.now(),
      },
      userName: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Post", postSchema);
