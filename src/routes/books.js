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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (not logged in)
 *       500:
 *         description: Server error
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

    const book = await book.create({
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the book
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (not logged in)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

// PUT /api/books/:id (protected + validated)
router.put("/:id", requireAuth, validateBook, async (req, res, next) => {
  try {
    const { _id, ...updates } = req.body;

    const book = await book.findByIdAndUpdate(req.params.id, updates, {
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book deleted
 *       401:
 *         description: Unauthorized (not logged in)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

// DELETE /api/books/:id (protected)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const book = await book.findByIdAndDelete(req.params.id);

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
