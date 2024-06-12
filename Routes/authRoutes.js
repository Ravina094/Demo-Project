const express = require("express");
const passport = require("../Utills/passport");
const authController = require("../Controllers/authController");

const router = express.Router();

// Local registration
router.post("/register", authController.registerUser);

// Local login
router.post("/login", passport.authenticate("local"), authController.loginUser);

// Facebook authentication
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  authController.loginUser
);

// Google authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.loginUser
);

router.get("/weather", passport.authenticate("local"), authController.getWeather);

module.exports = router;
