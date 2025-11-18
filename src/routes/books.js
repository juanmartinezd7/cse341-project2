// src/routes/books.js

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

const express = require("express");
const Book = require("../models/book");
const requireAuth = require("../middleware/requireAuth");
const { validateBook } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 */
// GET /api/books - list all books (public)
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find().populate("authorId", "name");
    res.json(books);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 */
// GET /api/books/:id (public)
router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "authorId",
      "name"
    );
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book (requires auth)
 *     tags: [Books]
 */
// POST /api/books (protected + validated)
router.post("/", requireAuth, validateBook, async (req, res, next) => {
  try {
    const {
      title,
      authorId,
      price,
      publishedYear,
      genres,
      inStock,
      rating
    } = req.body;

    const book = await Book.create({
      title,
      authorId,
      price,
      publishedYear,
      genres,
      inStock,
      rating
    });

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book (requires auth)
 *     tags: [Books]
 */
// PUT /api/books/:id (protected + validated)
router.put("/:id", requireAuth, validateBook, async (req, res, next) => {
  try {
    const { _id, ...updates } = req.body;

    const book = await Book.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.json(book);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book (requires auth)
 *     tags: [Books]
 */
// DELETE /api/books/:id (protected)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
