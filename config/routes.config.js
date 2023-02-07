const router = require('express').Router();

const authController = require('../controllers/auth.controller');

router.get('/', (req, res, next) => {
  res.render('index')
});

router.get('/register', authController.register);
router.post('/register', authController.doRegister);

router.get('/login', authController.login);

module.exports = router;