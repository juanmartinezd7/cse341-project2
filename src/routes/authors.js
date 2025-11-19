// src/routes/authors.js

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

const express = require("express");
const author = require("../models/author");
const requireAuth = require("../middleware/requireAuth");
const { validateAuthor } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Server error
 */

// GET /api/authors (public)
router.get("/", async (req, res, next) => {
  try {
    const authors = await author.find();
    res.json(authors);
  } catch (err) {
    next(err);
  }
});


/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the author
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */

// GET /api/authors/:id (public)
router.get("/:id", async (req, res, next) => {
  try {
    const foundAuthor = await author.findById(req.params.id).populate(
      "name"
    );

    if (!foundAuthor) {
      res.status(404);
      throw new Error("Author not found");
    }

    res.json(foundAuthor);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Create a new author (requires auth)
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       201:
 *         description: Author created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (not logged in)
 *       500:
 *         description: Server error
 */

// POST /api/authors (protected + validated)
router.post("/", requireAuth, validateAuthor, async (req, res, next) => {
  try {
    const { name, bio, website, country } = req.body;

    const author = await author.create({ name, bio, website, country });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Update an author (requires auth)
 *     tags: [Authors]
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
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: Author updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (not logged in)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

// PUT /api/authors/:id (protected + validated)
router.put("/:id", requireAuth, validateAuthor, async (req, res, next) => {
  try {
    const { _id, ...updates } = req.body;

    const author = await author.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!author) {
      res.status(404);
      throw new Error("Author not found");
    }

    res.json(author);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Delete an author (requires auth)
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the author
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Author deleted
 *       401:
 *         description: Unauthorized (not logged in)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

// DELETE /api/authors/:id (protected)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const author = await author.findByIdAndDelete(req.params.id);

    if (!author) {
      res.status(404);
      throw new Error("Author not found");
    }

    res.json({ message: "Author deleted" });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
