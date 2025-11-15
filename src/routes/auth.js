//src/routes/auth.js

///**
 //* @swagger
 //* tags:
 //*   name: Auth
 //*   description: OAuth-based authentication using Google
 //*/

const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google OAuth flow
///**
 //* @swagger
 //* /auth/google:
 //*   get:
 //*     summary: Start Google OAuth 2.0 login
 //*     tags: [Auth]
 //*     responses:
 //*       302:
 //*         description: Redirects to Google for authentication
 //*/
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// OAuth callback
///**
 //* @swagger
 //* /auth/google/callback:
 //*   get:
 //*     summary: Google OAuth callback
 //*     tags: [Auth]
 //*     responses:
 //*       200:
 //*         description: Logged in with Google
 //*         content:
 //*           application/json:
 //*             schema:
 //*               type: object
 //*               properties:
 //*                 message:
 //*                   type: string
 //*                 user:
 //*                   $ref: '#/components/schemas/User'
 //*       401:
 //*         description: Google authentication failed
 //*/
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure"
  }),
  (req, res) => {
    // Successful auth
    res.json({
      message: "Logged in with Google",
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email
      }
    });
  }
);

//GET /auth/me
///**
 //* @swagger
 //* /auth/me:
 //*   get:
 //*     summary: Get current authenticated user
 //*     tags: [Auth]
 //*     responses:
 //*       200:
 //*         description: Authenticated user
 //*         content:
 //*           application/json:
 //*             schema:
 //*               $ref: '#/components/schemas/User'
 //*       401:
 //*         description: Not authenticated
 //*/
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({
    id: req.user._id,
    displayName: req.user.displayName,
    email: req.user.email
  });
});

//GET /auth/logout
///**
 //* @swagger
 //* /auth/logout:
 //*   get:
 //*     summary: Logout current user
 //*     tags: [Auth]
 //*     responses:
 //*       200:
 //*         description: Logged out successfully
 //*/
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

router.get("/failure", (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

module.exports = router;
