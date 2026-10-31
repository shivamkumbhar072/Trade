
const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/userController");

const {
  googleAuth,
} = require("../controllers/googleAuthController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Email & Password Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google Authentication
router.post("/google-auth", googleAuth);

// Get Logged-in User
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
