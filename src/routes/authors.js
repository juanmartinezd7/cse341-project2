// src/routes/authors.js

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

const express = require("express");
const Author = require("../models/author");
const requireAuth = require("../middleware/requireAuth");
const { validateAuthor } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 */
// GET /api/authors (public)
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
 */
// GET /api/authors/:id (public)
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
 *     summary: Create a new author (requires auth)
 *     tags: [Authors]
 */
// POST /api/authors (protected + validated)
router.post("/", requireAuth, validateAuthor, async (req, res, next) => {
  try {
    const { name, bio, website, country } = req.body;

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
 *     summary: Update an author (requires auth)
 *     tags: [Authors]
 */
// PUT /api/authors/:id (protected + validated)
router.put("/:id", requireAuth, validateAuthor, async (req, res, next) => {
  try {
    const { _id, ...updates } = req.body;

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
 *     summary: Delete an author (requires auth)
 *     tags: [Authors]
 */
// DELETE /api/authors/:id (protected)
router.delete("/:id", requireAuth, async (req, res, next) => {
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
