
const mongoose = require("mongoose");
const Enquiry = require("../models/Enquiry");

const ALLOWED_BOTTLE_SIZES = [
  "250 ml",
  "330 ml",
  "500 ml",
  "1 L",
  "1.5 L",
  "5 L",
  "Other",
];

const ALLOWED_UNITS = [
  "bottles",
  "cartons",
  "20ft container",
  "40ft container",
];

const ALLOWED_PACKAGING = [
  "PET bottles",
  "Private label",
  "Custom packaging",
  "Other",
];

const ALLOWED_STATUSES = [
  "New",
  "Contacted",
  "Quoted",
  "Negotiating",
  "Converted",
  "Closed",
];

// PUBLIC: Submit an enquiry
const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      companyName,
      email,
      whatsappCountryCode,
      whatsappNumber,
      destinationCountry,
      bottleSize,
      quantity,
      quantityUnit,
      packagingPreference,
      destinationPort,
      additionalRequirements,
      whatsappConsent,
    } = req.body;

    const requiredStrings = {
      name,
      email,
      whatsappCountryCode,
      whatsappNumber,
      destinationCountry,
      bottleSize,
      quantityUnit,
    };

    for (const [field, value] of Object.entries(requiredStrings)) {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    if (
      name.trim().length < 2 ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    if (!/^\+?[0-9]{1,5}$/.test(whatsappCountryCode.trim())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid WhatsApp country code",
      });
    }

    const normalizedWhatsapp = whatsappNumber.replace(/[\s()-]/g, "");

    if (!/^[0-9]{5,20}$/.test(normalizedWhatsapp)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid WhatsApp number",
      });
    }

    if (!ALLOWED_BOTTLE_SIZES.includes(bottleSize)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bottle size",
      });
    }

    if (!ALLOWED_UNITS.includes(quantityUnit)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity unit",
      });
    }

    if (
      !Number.isSafeInteger(Number(quantity)) ||
      Number(quantity) < 1 ||
      Number(quantity) > 1000000000
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid positive whole number",
      });
    }

    if (
      packagingPreference &&
      !ALLOWED_PACKAGING.includes(packagingPreference)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid packaging preference",
      });
    }

    if (
      typeof additionalRequirements === "string" &&
      additionalRequirements.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message: "Additional requirements cannot exceed 2000 characters",
      });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      companyName:
        typeof companyName === "string"
          ? companyName.trim()
          : "",
      email: normalizedEmail,
      whatsappCountryCode: whatsappCountryCode.trim().startsWith("+")
        ? whatsappCountryCode.trim()
        : `+${whatsappCountryCode.trim()}`,
      whatsappNumber: normalizedWhatsapp,
      destinationCountry: destinationCountry.trim(),
      bottleSize,
      quantity: Number(quantity),
      quantityUnit,
      packagingPreference: packagingPreference || "PET bottles",
      destinationPort:
        typeof destinationPort === "string"
          ? destinationPort.trim()
          : "",
      additionalRequirements:
        typeof additionalRequirements === "string"
          ? additionalRequirements.trim()
          : "",
      whatsappConsent: whatsappConsent === true,
    });

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully",
      enquiryId: enquiry._id,
    });
  } catch (error) {
    console.error("Create enquiry error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit enquiry",
    });
  }
};

// ADMIN: List, search and paginate enquiries
const getEnquiries = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim().slice(0, 100)
        : "";

    const filter = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { name: regex },
        { companyName: regex },
        { email: regex },
        { destinationCountry: regex },
        { whatsappNumber: regex },
      ];
    }

    if (
      typeof req.query.status === "string" &&
      ALLOWED_STATUSES.includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      enquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get enquiries error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enquiries",
    });
  }
};

// ADMIN: Get one enquiry
const getEnquiryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID",
      });
    }

    const enquiry = await Enquiry.findById(req.params.id).select("-__v");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    console.error("Get enquiry error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enquiry",
    });
  }
};

// ADMIN: Update enquiry status
const updateEnquiryStatus = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID",
      });
    }

    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry status updated",
      enquiry,
    });
  } catch (error) {
    console.error("Update enquiry status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update enquiry",
    });
  }
};

// ADMIN: Enquiry dashboard counts
const getEnquiryStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [total, newCount, recentCount] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "New" }),
      Enquiry.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        total,
        new: newCount,
        receivedLast7Days: recentCount,
      },
    });
  } catch (error) {
    console.error("Get enquiry stats error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enquiry statistics",
    });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  getEnquiryStats,
};
