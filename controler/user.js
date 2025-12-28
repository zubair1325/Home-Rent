const User = require("../models/user.js");

module.exports.renderSingupForm = (req, res) => {
  res.render("user/singup.ejs");
};

module.exports.singUp = async (req, res) => {
  let { email, username, password } = req.body;
  let uname = await User.findOne({username})
  let user = await User.findOne({ email });
  if(uname){
    req.flash("error", "Username not available!");
    return res.redirect("/singup");
  }
  if (user) {
    req.flash("error", "Email account already esists!");
    return res.redirect("/singup");
  }
  let newUser = new User({ email, username });
  await User.register(newUser, password);
  req.login(newUser, (err) => {
    if (err) {
      req.flash("error", "somthing went wrong");
      return next(err);
    }
    req.flash("success", "New Account Created Successfully and Logged In");
    res.redirect("/listings");
  });
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  let  username  = req.user.username;
  console.log(req.user.username)
   console.log(req.user)
  req.flash("success", `Welcome back ${username}`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "Logout succesfully!");
      res.redirect("/listings");
    }
  });
};

module.exports.userProfile = (req,res)=>{
  console.log("entered into userprofile")
  res.render("./user/userProfile.ejs")
}
// module.exports.editUserProfile = (req,res)=>{
//   res.render("./user/editProfile.ejs")

// }

