// src/middleware/validation.js

// Validate body for Books (POST & PUT)
const validateBook = (req, res, next) => {
  const { title, authorId, price, publishedYear } = req.body;

  if (!title || !authorId || price === undefined || publishedYear === undefined) {
    res.status(400);
    return next(
      new Error(
        "title, authorId, price, and publishedYear are required"
      )
    );
  }

  // simple type checks (optional but nice)
  if (typeof title !== "string" || typeof authorId !== "string") {
    res.status(400);
    return next(new Error("title and authorId must be strings"));
  }

  if (typeof price !== "number" || typeof publishedYear !== "number") {
    res.status(400);
    return next(new Error("price and publishedYear must be numbers"));
  }

  next();
};

// Validate body for Authors (POST & PUT)
const validateAuthor = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    return next(new Error("name is required"));
  }

  if (typeof name !== "string") {
    res.status(400);
    return next(new Error("name must be a string"));
  }

  next();
};

module.exports = {
  validateBook,
  validateAuthor
};
