const express = require('express');
const router = express.Router();
const {
    searchBuses,
} = require('../controllers/CommuterController');
const authMiddleware = require('../middleware/authMiddleware');
const operatorMiddleware = require('../middleware/commuterMiddleware');

/**
 * @swagger
 * /api/commuter/searchbus:
 *   get:
 *     summary: Search for buses based on departure point, arrival point, and travel date.
 *     tags: [Commuters]
 *     parameters:
 *       - in: query
 *         name: departurePoint
 *         schema:
 *           type: string
 *         required: true
 *         description: The departure location of the bus.
 *       - in: query
 *         name: arrivalPoint
 *         schema:
 *           type: string
 *         required: true
 *         description: The arrival location of the bus.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: |
 *           The travel date. Format: YYYY-MM-DD
 *     responses:
 *       200:
 *         description: List of matching buses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   route:
 *                     type: object
 *                     properties:
 *                       routeNumber:
 *                         type: string
 *                         example: "1587"
 *                       routeName:
 *                         type: string
 *                         example: "Colombo to Kurunegala"
 *                   bus:
 *                     type: object
 *                     properties:
 *                       registrationNumber:
 *                         type: string
 *                         example: "XYZ1234"
 *                       operatorName:
 *                         type: string
 *                         example: "ABC Travels"
 *                       busType:
 *                         type: string
 *                         example: "Semi Luxury"
 *                       ticketPrice:
 *                         type: number
 *                         example: 1500
 *                       capacity:
 *                         type: number
 *                         example: 45
 *                       availableSeats:
 *                         type: number
 *                         example: 40
 *                   schedule:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         departurePoint:
 *                           type: string
 *                           example: "Colombo"
 *                         departureTime:
 *                           type: string
 *                           example: "2024-12-30T08:00:00Z"
 *                         arrivalPoint:
 *                           type: string
 *                           example: "Kurunegala"
 *                         arrivalTime:
 *                           type: string
 *                           example: "2024-12-30T11:00:00Z"
 *                         stops:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "Kadawatha"
 *       400:
 *         description: Missing or invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required query parameters: departurePoint, arrivalPoint, or date"
 *       404:
 *         description: No buses found for the specified criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No buses found for the specified criteria"
 *       500:
 *         description: Server error while fetching buses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching buses"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/searchbus', searchBuses);

module.exports = router;