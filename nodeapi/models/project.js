const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  leader: {
    type: ObjectId,
    ref: "User",
  },
  team: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  roles: [
    {
      roleName: {
        type: String,
        required: true,
      },
      roleSkills: {
        type: [String],
        required: true,
      },
      assignedTo: {
        type: ObjectId,
        ref: "User",
      },
      requestBy: [
        {
          type: ObjectId,
          ref: "User",
          status: "pending",
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
