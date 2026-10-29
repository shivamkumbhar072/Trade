
const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      default: "Bottled Mineral Water",
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    companyName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    whatsappCountryCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 6,
    },

    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    destinationCountry: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    bottleSize: {
      type: String,
      required: true,
      enum: ["250 ml", "330 ml", "500 ml", "1 L", "1.5 L", "5 L", "Other"],
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    quantityUnit: {
      type: String,
      required: true,
      enum: ["bottles", "cartons", "20ft container", "40ft container"],
    },

    packagingPreference: {
      type: String,
      enum: ["PET bottles", "Private label", "Custom packaging", "Other"],
      default: "PET bottles",
    },

    destinationPort: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    additionalRequirements: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    whatsappConsent: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Quoted", "Negotiating", "Converted", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Enquiry", enquirySchema);
