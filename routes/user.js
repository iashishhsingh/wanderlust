const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const { saveRedirectUrl } = require("../middleware/middleware.js");
const userController = require("../controllers/user.js");

// SIGNUP
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// LOGIN
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl, // ✅ must be here
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    userController.login // ✅ no comma here
  );

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;