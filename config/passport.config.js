const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User.model");

/* Esto no lo entiendo aún bien: ¿por qué primero pedimos user y luego id?*/
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
            return user.checkPassword(password).then((match) => {
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
);
