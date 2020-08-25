const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // Pending - Restrict only to the 4 types.
    type: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      unique: true,
      type: String,
      required: true,
      trim: true,
    },
    motivation: {
      type: String,
      required: true,
      trim: true,
    },
    objective: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    preTaskPhotos: [{ type: Buffer }],
    postTaskPhotos: [{ type: Buffer }],
    others: {
      name: {
        type: String,
        required: false,
        trim: true,
      },
      description: {
        type: String,
        required: false,
        trim: true,
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
