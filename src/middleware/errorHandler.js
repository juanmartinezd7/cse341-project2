//src/middleware/errorHandler.js

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? "error" : err.stack
  });
};

module.exports = { notFound, errorHandler };
