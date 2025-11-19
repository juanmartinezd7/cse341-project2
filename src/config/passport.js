// src/config/passport.js
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const user = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id); // MongoDB _id
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } =
  process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  console.warn(
    "GitHub OAuth env vars missing; skipping GitHubStrategy registration."
  );
} else {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
        scope: ["user:email"]
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            user = await User.create({
              githubId: profile.id,
              username: profile.username,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

module.exports = passport;

