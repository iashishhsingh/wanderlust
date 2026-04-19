require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = process.env.ATLASDB;

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in mongosession store", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 + 1000,
    maxAge: 7 * 24 * 60 * 60 + 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(cookieParser("secretcode"));
app.use(flash());

//  to use passpport for every req
app.use(passport.initialize());
// to maintain the user infor in seesion
app.use(passport.session());
// use  authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
// to store and unstore user data in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ROOT Route
app.get("/", (req, res) => {
  // res.send("This is root page");
  res.redirect("/listings");
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "fake@gmail.com",
    username: "faketest",
  });

  let registeredUser = await User.register(fakeUser, "hellouser");
  res.send(registeredUser);
});

// for lisitngs
app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

app.use((req, res, next) => {
  // throw new ExpressError(404,"Page not Found");
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // 🔥 important
  }
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is running on 8080");
});
