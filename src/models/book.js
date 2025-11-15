//src/models/book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true
    },
    price: { type: Number, required: true },
    publishedYear: { type: Number, required: true },
    genres: [{ type: String }],
    inStock: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
