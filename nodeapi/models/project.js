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
  status: {
    type: String,
    default: "Not Completed",
  },
  completion_percentage: {
    type: Number,
    required: true,
  },
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
      position: {
        x: 0,
        y: 0,
      },
      taskName: {
        type: String,
      },
      taskDescription: {
        type: String,
      },
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
      predecessors: [ObjectId], // taskIds
    },
  ],
  connections: [
    {
      from: ObjectId, // taskIds
      to: ObjectId, // taskIds
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
