// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String },
    displayName: { type: String },
    email: { type: String },
    avatar: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

