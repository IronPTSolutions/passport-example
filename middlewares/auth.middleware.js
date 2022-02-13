
// si se autoriza next si no al login de nuevo

module.exports.isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login')
  }
}


//si no user next, todo lo contrario al profile.

module.exports.isNotAuthenticated = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect('/profile')
  }
}