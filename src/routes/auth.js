// src/routes/auth.js
const express = require("express");
const passport = require("passport");

const router = express.Router();

/**
 * GET /auth/github
 * Start GitHub OAuth login (redirects to GitHub)
 */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

/**
 * GET /auth/github/callback
 * GitHub OAuth callback
 */
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", (err, user, info) => {
    if (err) {
      console.error("GitHub OAuth error:", err);
      return res
        .status(500)
        .json({ message: "GitHub OAuth failed", error: "oauth_error" });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "GitHub authentication failed" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error after GitHub auth:", loginErr);
        return res
          .status(500)
          .json({ message: "Login failed", error: "login_error" });
      }

      return res.json({
        message: "Logged in with GitHub",
        user: {
          id: user._id,
          githubId: user.githubId,
          username: user.username,
          displayName: user.displayName,
          email: user.email
        }
      });
    });
  })(req, res, next);
});

/**
 * GET /auth/me
 * Return the current authenticated user
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
 * GET /auth/logout
 * Logout current user
 */
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

router.get("/failure", (req, res) => {
  res.status(401).json({ message: "GitHub authentication failed" });
});

module.exports = router;
