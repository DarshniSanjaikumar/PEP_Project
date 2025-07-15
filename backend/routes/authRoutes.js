import express from "express";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // for hashing new password

const router = express.Router();

// Utility to generate 6-digit verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// ------------------- SIGNUP FLOW -------------------

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

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    res.cookie("user_name", user.username, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    res.status(201).json({
      message: "Registration completed successfully!",
      token,
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

// ------------------- LOGIN -------------------

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Username not found" });
    if (!user.verified) return res.status(403).json({ message: "Account not verified" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    res.cookie("user_name", user.username, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

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

// ------------------- FORGOT PASSWORD -------------------

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "DreamScape Password Reset",
      html: `
        <p>Hello ${user.username},</p>
        <p>You requested a password reset. Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- RESET PASSWORD -------------------

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ------------------- LOGOUT -------------------

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("user_name", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

// ------------------- PROFILE -------------------

router.get("/profile", (req, res) => {
  const user_name = req.cookies?.user_name;

  if (!user_name) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.status(200).json({ userName: user_name });
});

export default router;
