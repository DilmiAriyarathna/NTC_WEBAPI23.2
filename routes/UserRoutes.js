// routes/UserRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               role:
 *                 type: string
 *                 enum: [Admin, Operator, Commuter]
 *                 description: The role of the user (default is Commuter)
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 id:
 *                   type: string
 *                   description: The ID of the registered user
 *                 name:
 *                   type: string
 *                   description: Name of the registered user
 *                 email:
 *                   type: string
 *                   description: Email of the registered user
 *                 role:
 *                   type: string
 *                   description: Role of the registered user
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user and get a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User successfully logged in and token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SUCCESSFULLY! Login successfully
 *                 token:
 *                   type: string
 *                   description: The generated JWT token
 *                 id:
 *                   type: string
 *                   description: User ID
 *                 name:
 *                   type: string
 *                   description: User name
 *                 email:
 *                   type: string
 *                   description: User email
 *                 role:
 *                   type: string
 *                   description: User role
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', loginUser);


/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                 name:
 *                   type: string
 *                   description: The user's name
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 role:
 *                   type: string
 *                   description: The user's role
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The account creation date
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
