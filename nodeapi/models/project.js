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
  skills: [String],
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
        },
      ],
    },
  ],
  tasks: [
    {
      taskName: {
        type: String,
      },
      taskDescription: {
        type: String,
      },
      taskSkills: [String],
      assignedTo: [
        {
          type: ObjectId,
          ref: "User",
        },
      ],
      status: {
        type: String,
      },
      subtasks: [
        {
          subTaskName: {
            type: String,
          },
          subTaskDescription: {
            type: String,
          },
          done: {
            type: Boolean,
          },
        },
      ],
      pessimisticTime: {
        type: Number,
      },
      mostLikelyTime: {
        type: Number,
      },
      optimisticTime: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
