
const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const {
  getDashboard,
  getUsers,
} = require("../controllers/adminController");

// All routes below require admin authentication
router.use(adminAuth);

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);

module.exports = router;
