const express = require('express');
const passport = require('passport');

const router = express.Router();
const upload = require('../config/storage.config');

const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
]

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/register', authMiddleware.isNotAuthenticated, authController.register)
router.post('/register', authMiddleware.isNotAuthenticated, upload.single('image'), authController.doRegister)
router.get('/login', authMiddleware.isNotAuthenticated, authController.login)
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin)
router.get('/login/google', authMiddleware.isNotAuthenticated, passport.authenticate('google-auth', { scope: SCOPES  }))
router.get('/auth/google/callback', authMiddleware.isNotAuthenticated, authController.doLoginGoogle)
router.get('/logout', authMiddleware.isAuthenticated, authController.logout)

router.get('/profile', authMiddleware.isAuthenticated, usersController.profile)

module.exports = router;