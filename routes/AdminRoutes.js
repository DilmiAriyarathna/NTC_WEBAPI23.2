// routes/AdminRoutes.js
const express = require('express');
const { addRoute, addBus, getRoutes, getBuses } = require('../controllers/AdminController');
const authMiddleware = require('../middleware/authMiddleware');
// const adminMiddleware = require('../middleware/adminMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/admin/routes:
 *   post:
 *     summary: Add a new route
 *     tags: [Admin]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeNumber
 *               - startingPoint
 *               - endingPoint
 *               - distance
 *             properties:
 *               routeNumber:
 *                 type: string
 *                 description: Unique identifier for the route.
 *               startingPoint:
 *                 type: string
 *                 description: The starting point of the route.
 *               endingPoint:
 *                 type: string
 *                 description: The ending point of the route.
 *               distance:
 *                 type: string
 *                 description: The distance of the route.
 *     responses:
 *       201:
 *         description: Route added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Route added successfully
 *                 route:
 *                   type: object
 *                   properties:
 *                     routeNumber:
 *                       type: string
 *                       example: "R123"
 *                     startingPoint:
 *                       type: string
 *                       example: "City A"
 *                     endingPoint:
 *                       type: string
 *                       example: "City B"
 *                     distance:
 *                       type: string
 *                       example: "200km"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Failed to add route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to add route
 *                 error:
 *                   type: string
 */
router.post('/routes', authMiddleware, adminMiddleware, addRoute);


/**
 * @swagger
 * /api/admin/buses:
 *   post:
 *     summary: Add a new bus
 *     tags: [Admin]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - busNumber
 *               - driverName
 *               - conductorName
 *               - operatorname
 *               - bustype
 *               - capacity
 *               - price
 *               - availableSeats
 *               - registrationNumber
 *               - routeNumber
 *             properties:
 *               busNumber:
 *                 type: string
 *                 description: Unique bus number
 *                 example: "BUS123"
 *               driverName:
 *                 type: string
 *                 description: Name of the bus driver
 *                 example: "John Doe"
 *               conductorName:
 *                 type: string
 *                 description: Name of the conductor
 *                 example: "Jane Doe"
 *               operatorname:
 *                 type: string
 *                 description: Name of the operator
 *                 example: "ABC Travels"
 *               bustype:
 *                 type: string
 *                 enum: [Luxury, Semi Luxury, Ordinary]
 *                 description: Type of the bus
 *                 example: "Semi Luxury"
 *               capacity:
 *                 type: integer
 *                 description: Seating capacity of the bus
 *                 example: 45
 *               price:
 *                 type: number
 *                 description: Ticket price for this bus
 *                 example: 1500.00
 *               availableSeats:
 *                 type: integer
 *                 description: Number of available seats
 *                 example: 30
 *               registrationNumber:
 *                 type: string
 *                 description: Unique registration number of the bus
 *                 example: "XYZ1234"
 *               routeNumber:
 *                 type: string
 *                 description: The human-readable route number assigned to the bus
 *                 example: "1587"
 *     responses:
 *       201:
 *         description: Bus added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bus added successfully
 *                 bus:
 *                   type: object
 *                   properties:
 *                     busId:
 *                       type: string
 *                       description: Auto-generated Bus ID
 *                       example: "2304"
 *                     busNumber:
 *                       type: string
 *                       description: Unique bus number
 *                       example: "BUS123"
 *                     driverName:
 *                       type: string
 *                       example: "John Doe"
 *                     conductorName:
 *                       type: string
 *                       example: "Jane Doe"
 *                     operatorname:
 *                       type: string
 *                       example: "ABC Travels"
 *                     bustype:
 *                       type: string
 *                       example: "Semi Luxury"
 *                     capacity:
 *                       type: integer
 *                       example: 45
 *                     price:
 *                       type: number
 *                       example: 1500.00
 *                     availableSeats:
 *                       type: integer
 *                       example: 30
 *                     registrationNumber:
 *                       type: string
 *                       example: "XYZ1234"
 *                     routeNumber:
 *                       type: string
 *                       example: "1587"
 *       400:
 *         description: Invalid request or duplicate registration number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A bus with this registration number already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to add bus
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
router.post('/buses', authMiddleware, adminMiddleware, addBus);


// Get routes and buses

/**
 * @swagger
 * /api/admin/routes:
 *   get:
 *     summary: Retrieve all routes
 *     tags: [Admin]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   routeNumber:
 *                     type: string
 *                   startingPoint:
 *                     type: string
 *                   endingPoint:
 *                     type: string
 *                   distance:
 *                     type: string
 *                   schedule:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - Invalid token or no token provided
 *       403:
 *         description: Forbidden - Admins only
 *       500:
 *         description: Server error
 */
router.get('/routes', authMiddleware, adminMiddleware, getRoutes);


/**
 * @swagger
 * /api/admin/buses:
 *   get:
 *     summary: Retrieve all buses
 *     tags: [Admin]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of all buses with route details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   busNumber:
 *                     type: string
 *                   routeDetails:
 *                     type: object
 *                     properties:
 *                       routeNumber:
 *                         type: string
 *                       startingPoint:
 *                         type: string
 *                       endingPoint:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - Invalid token or no token provided
 *       403:
 *         description: Forbidden - Admins only
 *       500:
 *         description: Server error
 */

router.get('/buses', authMiddleware, adminMiddleware, getBuses);

module.exports = router;
