// src/server.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/db");
require("./config/passport"); 

const { notFound, errorHandler } = require("./middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const booksRouter = require("./routes/books");
const authorsRouter = require("./routes/authors");
const authRouter = require("./routes/auth");

const passport = require("passport");

const app = express();

// Connect to Mongo
connectDB();

// Core middleware
app.use(cors());
app.use(express.json());


// Session (for OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Bookstore API is running" });
});

// API routes
app.use("/auth", authRouter);
app.use("/api/books", booksRouter);
app.use("/api/authors", authorsRouter);

// Error handlers 
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
