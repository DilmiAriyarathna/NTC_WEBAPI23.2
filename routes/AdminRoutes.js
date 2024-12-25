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
 *               - schedule
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
 *               schedule:
 *                 type: string
 *                 description: The schedule for the route.
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
 *                     startingPoint:
 *                       type: string
 *                     endingPoint:
 *                       type: string
 *                     distance:
 *                       type: string
 *                     schedule:
 *                       type: string
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
 *               - capacity
 *               - registrationNumber
 *               - routeId
 *             properties:
 *               busNumber:
 *                 type: string
 *                 description: The unique number of the bus
 *               driverName:
 *                 type: string
 *                 description: The name of the bus driver
 *               capacity:
 *                 type: integer
 *                 description: The seating capacity of the bus
 *               registrationNumber:
 *                 type: string
 *                 description: The unique registration number of the bus
 *               routeId:
 *                 type: string
 *                 description: The ID of the route assigned to the bus
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
 *                       example: "2304"
 *                     busNumber:
 *                       type: string
 *                       example: "12345"
 *                     driverName:
 *                       type: string
 *                       example: "John Doe"
 *                     capacity:
 *                       type: integer
 *                       example: 40
 *                     registrationNumber:
 *                       type: string
 *                       example: "XYZ1234"
 *                     routeId:
 *                       type: string
 *                       example: "64c8b32f4b7c6d2e6c4b3e12"
 *       400:
 *         description: Invalid request or duplicate registration number
 *       500:
 *         description: Internal server error
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
