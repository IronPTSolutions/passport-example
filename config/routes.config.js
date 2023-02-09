const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

router.get("/", (req, res, next) => {
  res.render("index");
});
router.get(
  "/register",
  authMiddleware.isNotAuthenticated,
  authController.register
);
router.get("/login", authMiddleware.isNotAuthenticated, authController.login);
router.post(
  "/register",
  authMiddleware.isNotAuthenticated,
  authController.doRegister
);
router.post(
  "/login",
  authMiddleware.isNotAuthenticated,
  authController.doLogin
);
router.get("/profile", authMiddleware.isAuthenticated, authController.profile);
router.get(
  "/login/google",
  passport.authenticate("google-auth", { scope: GOOGLE_SCOPES })
);
router.get("/auth/google/callback", authController.doLoginGoogle);
router.get("/logout", authController.doLogout);

module.exports = router;
