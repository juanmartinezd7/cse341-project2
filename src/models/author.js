//src/models/author.js
const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: { type: String },
    website: { type: String },
    country: { type: String }
  },
  { timestamps: true }
);


module.exports = mongoose.model("author", authorSchema);
