// src/routes/books.js

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

const express = require("express");
const Book = require("../models/book");

const router = express.Router();

/**
 * @swagger
 * /api/books:
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the book
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
 *     summary: Create a new book
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
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res, next) => {
  try {
    const { title, authorId, price, publishedYear, genres, inStock, rating } =
      req.body;

    if (!title || !authorId || !price || !publishedYear) {
      res.status(400);
      throw new Error(
        "title, authorId, price, and publishedYear are required"
      );
    }

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
 *     summary: Update a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
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
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res, next) => {
  try {
    // Destructure and ignore _id if sent
    const { _id, title, authorId, price, publishedYear, genres, inStock, rating } =
      req.body;

    // Require the same fields as POST for a full PUT
    if (!title || !authorId || price === undefined || publishedYear === undefined) {
      res.status(400);
      throw new Error(
        "title, authorId, price, and publishedYear are required for PUT"
      );
    }

    const updates = {
      title,
      authorId,
      price,
      publishedYear,
      genres,
      inStock,
      rating
    };

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
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the book
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res, next) => {
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
