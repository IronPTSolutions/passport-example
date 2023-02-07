const mongoose = require("mongoose");
const User = require("../models/User.model");

module.exports.register = (req, res, next) => {
  res.render('auth/register');
};

module.exports.doRegister = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render('auth/register', {
      user: {
        name: req.body.name,
        email: req.body.email
      },
      errors,
    });
  };

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return User.create(req.body)
        .then((user) => {
          console.log({user})
          console.info(`${user.name} has been created!`);
          res.redirect('/login');
        });
      } else {
        renderWithErrors({ 
          email: "Email already in use" 
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("auth/login");
};

