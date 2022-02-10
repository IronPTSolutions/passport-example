const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/register', authController.register)
router.post('/register', authController.doRegister)
router.get('/login', authController.login)

module.exports = router;