const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { registerUser, registerPartner, login, logout, getMe } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const passwordRules = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');
const emailRules = body('email').isEmail().withMessage('Valid email required');
const nameRules = body('name').notEmpty().withMessage('Name is required');

/**
 * @swagger
 * /api/auth/register-user:
 *   post:
 *     summary: Register a new customer
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register-user', [nameRules, emailRules, passwordRules], validate, registerUser);

/**
 * @swagger
 * /api/auth/register-partner:
 *   post:
 *     summary: Register a new venue partner
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: Partner registered successfully
 */
router.post('/register-partner', [nameRules, emailRules, passwordRules], validate, registerPartner);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login for both roles
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 */
router.post('/login', [emailRules, passwordRules], validate, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout (client discards token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', verifyToken, logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get('/me', verifyToken, getMe);

module.exports = router;
