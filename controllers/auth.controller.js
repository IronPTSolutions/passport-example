const User = require('../models/User.model');
const mongoose = require('mongoose');
const passport = require('passport');

module.exports.register = (req, res, next) => {
  res.render('auth/register', )
}



module.exports.doRegister = (req, res, next) => {
  const user = req.body;
  User.findOne({ email: user.email })
    .then((userFound) => {
      if (userFound) {
        res.render("auth/register", { user, errors: { email: "Email already exist" }
        });
      } else {
        return User.create(user).then((user) => {
          req.session.currentUser = user;
          res.redirect("/profile");
        })
      }
    })
    .catch((err) => {
      res.render("auth/register", {
        user,
        errors: err.errors,
      });
      next(err);
    });
};

//////////////



const loginCons = (req, res, next, provider) => {
  passport.authenticate(provider || 'local-auth', (err, user, validations) => {
    if (err) {
      next(err)
    } else if(!user) {
      res.status(404).render('auth/login', { errors: validations.error })
    } else {
      req.login(user, (loginError) => {
        if (loginError) {
          next(loginError)
        } else {
          req.session.currentUser = user;
          res.redirect('/profile')
        }
      })
    }
  })(req, res, next)
};

module.exports.login = (req, res, next) => {
  res.render('auth/login', )
};

module.exports.doLogin =(req, res, next) => {
  loginCons(req,res,next);
};

module.exports.doLoginGoogle =(req, res, next) => {
  loginCons(req,res,next, 'google-auth');
};


module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
}
