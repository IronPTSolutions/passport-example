

module.exports.profile = (req, res, next) => {
    res.render('profile', { user: req.user})
}