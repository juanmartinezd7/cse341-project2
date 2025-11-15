// src/routes/authors.js

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

const express = require("express");
const Author = require("../models/author");

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
router.get("/", async (req, res, next) => {
  try {
    const authors = await Author.find();
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
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the author
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
router.get("/:id", async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
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
 * /api/authors:
 *   post:
 *     summary: Create a new author
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
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, bio, website, country } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("name is required");
    }

    const author = await Author.create({ name, bio, website, country });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Update an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: Author updated
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { _id, name, bio, website, country } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("name is required for PUT");
    }

    const updates = { name, bio, website, country };

    const author = await Author.findByIdAndUpdate(req.params.id, updates, {
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
 *     summary: Delete an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Author deleted
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);

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
