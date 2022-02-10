
module.exports.profile = (req, res, next) => {
    res.render('profile', { user: req.user})
}


// en apps.js luego le decimos que req.user = currentUser
