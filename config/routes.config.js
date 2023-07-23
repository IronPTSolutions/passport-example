const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware.js");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/register",authMiddleware.isNotAuthenticated,authController.register);
router.post("/register",authMiddleware.isNotAuthenticated,authController.doRegister);
router.get("/login", authMiddleware.isNotAuthenticated, authController.login);
router.post("login", authMiddleware.isNotAuthenticated, authController.doLogin);
router.get("logout", authMiddleware.isAuthenticated, authController.logout);

router.get('/profile', authMiddleware.isAuthenticated, userController.profile);

module.exports = router;
