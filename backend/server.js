// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// require('dotenv').config();

// // const app = express();
// // const PORT = process.env.PORT || 5001;

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // MongoDB Connection
// // mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/DreamScape', {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // });

// // const db = mongoose.connection;
// // db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// // db.once('open', () => console.log('✅ Connected to MongoDB'));

// // // User Schema
// // const userSchema = new mongoose.Schema({
// //   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// //   username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
// //   password: { type: String, required: true, minlength: 8 },
// //   isVerified: { type: Boolean, default: false },
// //   createdAt: { type: Date, default: Date.now }
// // });

// // // Verification Code Schema
// // const verificationSchema = new mongoose.Schema({
// //   email: { type: String, required: true, lowercase: true, trim: true },
// //   code: { type: String, required: true },
// //   createdAt: { type: Date, default: Date.now, expires: 900 } // Expires in 15 mins
// // });

// // const User = mongoose.model('User', userSchema);
// // const VerificationCode = mongoose.model('VerificationCode', verificationSchema);

// // // Email transporter
// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS
// //   }
// // });

// // // Verify transporter
// // transporter.verify((err, success) => {
// //   if (err) {
// //     console.error('❌ Email transporter failed:', err);
// //   } else {
// //     console.log('📧 Email transporter ready');
// //   }
// // });

// // // Helpers
// // const generateVerificationCode = () => crypto.randomInt(100000, 999999).toString();

// // const sendVerificationEmail = async (email, code) => {
// //   const mailOptions = {
// //     from: `"DreamScape" <${process.env.EMAIL_USER}>`,
// //     to: email,
// //     subject: 'DreamScape - Email Verification Code',
// //     html: `
// //       <div style="font-family: Arial; padding: 20px; background: #1e1e2f; color: white; border-radius: 8px;">
// //         <h2 style="color: #a78bfa;">Welcome to DreamScape!</h2>
// //         <p>Use the code below to verify your email address:</p>
// //         <h1 style="font-size: 36px; letter-spacing: 6px;">${code}</h1>
// //         <p>This code will expire in 15 minutes.</p>
// //       </div>
// //     `
// //   };

// //   try {
// //     await transporter.sendMail(mailOptions);
// //     return true;
// //   } catch (err) {
// //     console.error('📨 Error sending email:', err);
// //     return false;
// //   }
// // };

// // // Routes
// // app.post('/api/verify/send-code', async (req, res) => {
// //   const { email } = req.body;
// //   if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
// //     return res.status(400).json({ error: 'Valid email is required' });
// //   }

// //   const existingUser = await User.findOne({ email });
// //   if (existingUser) return res.status(400).json({ error: 'User with this email already exists' });

// //   const code = generateVerificationCode();
// //   await VerificationCode.deleteMany({ email });
// //   await new VerificationCode({ email, code }).save();

// //   const emailSent = await sendVerificationEmail(email, code);
// //   if (!emailSent) return res.status(500).json({ error: 'Failed to send verification email' });

// //   res.json({
// //     success: true,
// //     message: 'Verification code sent',
// //     devCode: process.env.NODE_ENV === 'development' ? code : undefined
// //   });
// // });

// // app.post('/api/verify/verify-code', async (req, res) => {
// //   const { email, code } = req.body;
// //   if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

// //   const record = await VerificationCode.findOne({ email, code });
// //   if (!record) return res.status(400).json({ error: 'Invalid or expired code' });

// //   res.json({ success: true, message: 'Code verified' });
// // });

// // app.post('/api/users/register', async (req, res) => {
// //   const { email, username, password } = req.body;
// //   if (!email || !username || !password) return res.status(400).json({ error: 'All fields are required' });
// //   if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' });
// //   if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

// //   const codeCheck = await VerificationCode.findOne({ email });
// //   if (!codeCheck) return res.status(400).json({ error: 'Please verify your email first' });

// //   const emailExists = await User.findOne({ email });
// //   if (emailExists) return res.status(400).json({ error: 'Email already registered' });

// //   const usernameExists = await User.findOne({ username });
// //   if (usernameExists) return res.status(400).json({ error: 'Username is already taken' });

// //   const hashedPassword = await bcrypt.hash(password, 12);
// //   const newUser = await User.create({ email, username, password: hashedPassword, isVerified: true });

// //   await VerificationCode.deleteMany({ email });

// //   res.status(201).json({
// //     success: true,
// //     message: 'User registered',
// //     user: {
// //       id: newUser._id,
// //       email: newUser.email,
// //       username: newUser.username,
// //       isVerified: newUser.isVerified,
// //       createdAt: newUser.createdAt
// //     }
// //   });
// // });

// // app.post('/api/verify/resend-code', async (req, res) => {
// //   const { email } = req.body;
// //   if (!email) return res.status(400).json({ error: 'Email is required' });

// //   const code = generateVerificationCode();
// //   await VerificationCode.deleteMany({ email });
// //   await new VerificationCode({ email, code }).save();

// //   const sent = await sendVerificationEmail(email, code);
// //   if (!sent) return res.status(500).json({ error: 'Failed to send email' });

// //   res.json({
// //     success: true,
// //     message: 'Verification code resent',
// //     devCode: process.env.NODE_ENV === 'development' ? code : undefined
// //   });
// // });

// // app.get('/api/users/check-username/:username', async (req, res) => {
// //   const { username } = req.params;
// //   const exists = await User.findOne({ username });
// //   res.json({
// //     available: !exists,
// //     message: exists ? 'Username taken' : 'Username available'
// //   });
// // });

// // app.get('/api/health', (req, res) => {
// //   res.json({ success: true, message: 'DreamScape API live', timestamp: new Date() });
// // });

// // app.use('*', (req, res) => {
// //   res.status(404).json({ error: 'Route not found' });
// // });

// // app.listen(PORT, () => {
// //   console.log(`🚀 DreamScape server running on port ${PORT}`);
// // });


// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import authRoutes from './routes/authRoutes.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("✅ Connected to MongoDB");
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// })
// .catch((err) => console.error("❌ MongoDB connection error:", err));
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Mongo Error:", err));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
