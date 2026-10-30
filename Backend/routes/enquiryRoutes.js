const express = require("express");

const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  getEnquiryStats,
} = require("../controllers/enquiryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Anyone can submit a product enquiry
router.post("/",authMiddleware, createEnquiry);

// Admin-only routes
router.get("/", authMiddleware, adminAuth, getEnquiries);
router.get("/stats", authMiddleware, adminAuth, getEnquiryStats);
router.get("/:id", authMiddleware, adminAuth, getEnquiryById);
router.patch("/:id/status", authMiddleware, adminAuth, updateEnquiryStatus);

module.exports = router;