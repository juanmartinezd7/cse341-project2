// src/routes/books.js

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

const express = require("express");
const book = require("../models/book");
const requireAuth = require("../middleware/requireAuth");
const { validateBook } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * /api/Books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 */

//GET /api/books - list all books (public)
router.get("/", async (req, res, next) => {
  try {
    const books = await book.find().populate("authorId", "name");
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res, next) => {
  try {
    const foundBook = await book.findById(req.params.id).populate(
      "authorId",
      "name"
    );

    if (!foundBook) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.json(foundBook);
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

    // 👇 NOTE: Use the model `Book`, and a different variable name
    const newBook = await book.create({
      title,
      authorId,
      price,
      publishedYear,
      genres,
      inStock,
      rating
    });

    res.status(201).json(newBook);
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put("/:id", requireAuth, validateBook, async (req, res, next) => {
  try {
    const { _id, ...updates } = req.body;

    // 👇 Again: use `Book` model and a different variable name
    const updatedBook = await book.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.json(updatedBook);
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *     responses:
 *       200:
 *         description: Book deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deletedBook = await book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
