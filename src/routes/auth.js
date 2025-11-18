// src/routes/auth.js
const express = require("express");
const passport = require("passport");

const router = express.Router();

/**
 * Start GitHub OAuth flow
 * GET /auth/github
 */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

/**
 * GitHub OAuth callback
 * GET /auth/github/callback
 */
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/failure"
  }),
  (req, res) => {
    // In a real app this might redirect to a frontend.
    res.json({
      message: "Logged in with GitHub",
      user: {
        id: req.user._id,
        githubId: req.user.githubId,
        username: req.user.username,
        displayName: req.user.displayName,
        email: req.user.email
      }
    });
  }
);

/**
 * Return current authenticated user
 * GET /auth/me
 */
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    id: req.user._id,
    githubId: req.user.githubId,
    username: req.user.username,
    displayName: req.user.displayName,
    email: req.user.email
  });
});

/**
 * Logout
 * GET /auth/logout
 */
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

/**
 * Auth failure
 * GET /auth/failure
 */
router.get("/failure", (req, res) => {
  res.status(401).json({ message: "GitHub authentication failed" });
});

module.exports = router;
