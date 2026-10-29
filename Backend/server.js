const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ADD THIS
const enquiryRoutes = require("./routes/enquiryRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://exportyard.com",
      "https://www.exportyard.com",
    ],
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ExportYard backend is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ADD THIS
app.use("/api/enquiries", enquiryRoutes);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();