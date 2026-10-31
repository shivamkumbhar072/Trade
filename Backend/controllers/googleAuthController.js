
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    if (!payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    const {
      sub: googleId,
      email,
      name,
      picture,
    } = payload;

    const normalizedEmail = email.toLowerCase();

    // Find user by Google ID or verified email
    let user = await User.findOne({
      $or: [
        { googleId },
        { email: normalizedEmail },
      ],
    });

    if (user) {
      // Link Google account to an existing email account
      if (!user.googleId) {
        user.googleId = googleId;
      }

      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
      }

      await user.save();
    } else {
      // Create new Google user
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId,
        authProvider: "google",
        profilePicture: picture || "",
      });
    }

    // Generate JWT using existing login convention
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Account already exists. Please try again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

module.exports = { googleAuth };
