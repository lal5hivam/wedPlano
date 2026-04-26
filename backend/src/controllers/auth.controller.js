const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/firebase');
const { asyncHandler, createError } = require('../middlewares/error.middleware');

const generateToken = (uid) =>
  jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register-user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await db.collection('users').where('email', '==', email).get();
  if (!existing.empty) throw createError('Email already registered', 409);

  const uid = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 12);

  const userData = {
    uid,
    role: 'user',
    name,
    email,
    phone: phone || '',
    profileImage: '',
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  await db.collection('users').doc(uid).set(userData);

  const token = generateToken(uid);
  const { passwordHash, ...safeUser } = userData;

  res.status(201).json({ success: true, token, user: safeUser });
});

// POST /api/auth/register-partner
const registerPartner = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await db.collection('users').where('email', '==', email).get();
  if (!existing.empty) throw createError('Email already registered', 409);

  const uid = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 12);

  const userData = {
    uid,
    role: 'partner',
    name,
    email,
    phone: phone || '',
    profileImage: '',
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  await db.collection('users').doc(uid).set(userData);

  const token = generateToken(uid);
  const { passwordHash, ...safeUser } = userData;

  res.status(201).json({ success: true, token, user: safeUser });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const snapshot = await db.collection('users').where('email', '==', email).get();
  if (snapshot.empty) throw createError('Invalid credentials', 401);

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  const isMatch = await bcrypt.compare(password, userData.passwordHash);
  if (!isMatch) throw createError('Invalid credentials', 401);

  const token = generateToken(userData.uid);
  const { passwordHash, ...safeUser } = userData;

  res.json({ success: true, token, user: safeUser });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  // JWT is stateless; client discards the token
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const { passwordHash, ...safeUser } = req.user;
  res.json({ success: true, user: safeUser });
});

module.exports = { registerUser, registerPartner, login, logout, getMe };
