const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userControler = require("../controler/user.js");


router
  .route("/singup")
  .get(userControler.renderSingupForm)
  .post(wrapAsync(userControler.singUp));

router
  .route("/login")
  .get(userControler.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControler.login
  );

router.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:"/login"}),(req,res)=>{
  res.redirect("/profile")
})
router.get("/logout", userControler.logout);

router.get("/profile",isLoggedIn,userControler.userProfile)
// router.get("/profile/edit",isLoggedIn,userControler.editUserProfile)


module.exports = router;
