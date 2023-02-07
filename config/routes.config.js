const router = require('express').Router();
const passport = require('passport');

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
]

router.get('/', (req, res, next) => {
  res.render('index')
});

router.get('/register', authMiddleware.isNotAuthenticated, authController.register);
router.post('/register', authMiddleware.isNotAuthenticated, authController.doRegister);

router.get('/login', authMiddleware.isNotAuthenticated, authController.login);
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin);

router.get('/login/google', authMiddleware.isNotAuthenticated, passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }));
router.get('/auth/google/callback', authMiddleware.isNotAuthenticated, authController.doLoginGoogle);

router.get('/logout', authMiddleware.isAuthenticated, authController.doLogout);

router.get('/profile', authMiddleware.isAuthenticated, userController.profile);

module.exports = router;