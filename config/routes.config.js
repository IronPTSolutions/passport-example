const express = require('express');
const passport = require('passport');

const router = express.Router();
const upload = require('../config/storage.config');

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/users.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
]

router.get('/', (req, res, next) => {
  res.render('index')
})

// añadimos un proceso mas a la tuberia
// si isNotAuthenticated solo le dejamos acceder login y register
// si isAutheticated le dejamos acceder perfil y logout.


router.get('/register', authMiddleware.isNotAuthenticated, authController.register)
router.get('/login', authMiddleware.isNotAuthenticated, authController.login)
router.post('/register', authMiddleware.isNotAuthenticated,upload.single('image'), authController.doRegister)
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin)
router.get('/logout', authMiddleware.isAuthenticated, authController.logout)

router.get('/login/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/auth/google/callback', authController.doLoginGoogle)


router.get('/profile', authMiddleware.isAuthenticated, userController.profile )

module.exports = router;