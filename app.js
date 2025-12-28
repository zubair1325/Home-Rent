require("dotenv").config();

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/WrapAsync.js");
const { title } = require("process");
const { wrap } = require("module");
const { error } = require("console");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const User = require("./models/user.js");

app.set("view viewEngine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//routers
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
//google auth
const PassportAuthGoogle = require("./passportAuthGoogle.js");

const mongoDbLink = process.env.ATLASDB_URL;
main().then(() => {
  console.log("DB connected");
});
async function main() {
  await mongoose.connect(mongoDbLink);
}

const store = MongoStore.create({
  mongoUrl: mongoDbLink,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  },
});

store.on("error", (e) => {
  console.log("error on mongo session store", e);
});
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); //make sure it integrate with express session
passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://stayease-6i92.onrender.com/auth/google/callback",
    },
    PassportAuthGoogle //from passportAuth.js file
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

//middleware
app.use((err, req, res, next) => {
  console.log("enterrend into middlewae route");
  let { message = "Something went wrong", statusCode = 500 } = err;
  console.log(err);
  res.status(statusCode).render("error.ejs", { message, statusCode });
  // res
});

app.listen(8080, () => {
  console.log("server online");
});
