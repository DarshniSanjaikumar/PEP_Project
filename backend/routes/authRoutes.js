import express from "express";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
const router = express.Router();

// Utility to generate 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Step 1: Send verification code
router.post("/signup", async (req, res) => {
  const { email } = req.body;
  try {
    const code = generateCode();

    let user = await User.findOne({ email });

    if (user && user.verified) {
      return res.status(400).json({ message: "Email already verified. Please login." });
    }

    if (!user) {
      user = new User({ email, verificationCode: code, verified: false });
    } else {
      user.verificationCode = code;
    }

    await user.save();

    await sendEmail({
      to: email,
      subject: "DreamScape Email Verification Code",
      html: `
        <div style="font-family:sans-serif;padding:20px;background:#f9f9f9">
          <h2>DreamScape Email Verification</h2>
          <p>Your 6-digit verification code is:</p>
          <h1 style="color:#7e5bef">${code}</h1>
          <p>Use this code to complete your registration.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Verification email sent", email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error sending email" });
  }
});

// Step 2: Verify Code
router.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Email not found" });

    if (user.verified) return res.status(400).json({ message: "Already verified" });

    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Invalid verification code" });

    user.verified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});

// Step 3: Register final account
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !user.verified)
      return res.status(400).json({ message: "Email not verified. Please verify first." });

    if (user.username && user.password)
      return res.status(400).json({ message: "Account already exists." });

    user.username = username;
    user.password = password;
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: user.email,
        username: user.username,
        id: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});


// Login route using username + password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({ message: "Username not found" });

    if (!user.verified)
      return res.status(403).json({ message: "Account not verified" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});
export default router;
