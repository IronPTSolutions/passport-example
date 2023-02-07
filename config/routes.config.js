const router = require('express').Router();
const passport = require('passport');

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
]

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/', (req, res, next) => {
  res.render('index')
});

router.get('/register', authMiddleware.isNotAuthenticated, authController.register);
router.post('/register', authMiddleware.isNotAuthenticated, authController.doRegister);

router.get('/login', authMiddleware.isNotAuthenticated, authController.login);
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin);

router.get('/logout', authMiddleware.isAuthenticated, authController.doLogout);

router.get('/profile', authMiddleware.isAuthenticated, userController.profile);

module.exports = router;