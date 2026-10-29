
const dns = require("node:dns");

// Use public DNS resolvers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "exportyard",
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB connected successfully!");
    console.log("Connected database:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
