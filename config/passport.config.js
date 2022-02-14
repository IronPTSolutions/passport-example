const passport = require("passport");

const mongoose = require("mongoose");

const LocalStrategy = require("passport-local").Strategy;

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User.model");

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((user) => { 
      next(null, user);
    })
    .catch((err) => next(err));
});

passport.use(
  "local-auth",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, next) => {
      
     /*  comprobamos si ya hay un usuario --> comparamos la contraseña --> go! */
     
     User.findOne({ email })
        .then((user) => {
          if (!user) {
            next(null, false, { error: "Wrong email or password" });
          } else {
            return user.checkPassword(password)
            .then((match) => {
              if (!match) {
                next(null, false, { error: "Wrong email or password" });
              } else {
                next(null, user);
              }
            });
          }
        })
        .catch((err) => next(err));
    }
  )
)

passport.use("google-auth", new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, next) => {
    const googleID = profile.id;
    const name = profile.displayName;
    const email = profile.emails && profile.emails[0].value || undefined;
    const image = profile.photos && profile.photos[0].value || undefined;
    /* se pone [0] para asegurarnos de que google nos devuelve un array */

    if(googleID && email) {
      User.findOne({ $or: [
        { email },
        { googleID }
      ]})
      .then(user => {
        if(user) {
          next(null, user)
        } else {
          return User.create({
            name,
            email,
            password: mongoose.Types.ObjectId(),
            googleID,
            image
          })
        }
      })
      .catch(err => next(err))
    } else {
      next(null, false, { error: 'Error conecting with Google Auth'})
    }

  }

))
