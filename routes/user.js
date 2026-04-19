const express = require("express");
const router = express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require('../controllers/users.js')

router.get("/signup",userController.renderSignupForm)

router.post("/signup",wrapAsync (userController.signup))

router.get("/login",userController.renderLoginForm)

router.post("/login",
    saveRedirectUrl,
    (req, res, next) => {
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next);
    },
    userController.login
);

router.get("/logout",userController.logout)
module.exports =router