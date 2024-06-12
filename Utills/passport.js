const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../Models");

/**
 * Local authentication strategy using email and password.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await db.user.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        const isValidPassword = await user.validPassword(password);
        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/**
 * Facebook authentication strategy.
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await db.user.findOne({ where: { facebookId: profile.id } });
        if (!user) {
          user = await db.user.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            facebookId: profile.id,
            password: null,
            location: null,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/**
 * Google authentication strategy.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await db.user.findOne({ where: { googleId: profile.id } });
        if (!user) {
          user = await db.user.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: null,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/**
 * Serialize the user ID to save in the session.
 * @param {Object} user - The authenticated user.
 * @param {Function} done - Callback function.
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialize the user by ID from the session.
 * @param {number} id - The user ID.
 * @param {Function} done - Callback function.
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
