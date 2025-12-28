require("dotenv").config();

const GoogleStrategy = require("passport-google-oauth20")
const User = require("./models/user.js")
const  { v4 : uuidv4 } =  require( 'uuid');

module.exports =  async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        //Check if user already exists with same email (local signup)
        let user = await User.findOne({ email });
        if (user) {
          // If user exists but has no googleId, connect it
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          if (!user.userPhoto) {
            user.userPhoto = profile.photos?.[0]?.value;
            await user.save();
          }


          return done(null, user);
        }

        //No email match → check googleId (very rare)
        user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create brand new user
          user = await User.create({
            googleId: profile.id,
            email: email,
            username:  profile.displayName +"_" + Math.floor(100000 * Math.random()) + Math.floor(100000 * Math.random()),
            userPhoto: profile.photos?.[0]?.value
          });
        }




        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
