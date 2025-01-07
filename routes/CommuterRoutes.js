const express = require('express');
const router = express.Router();
const {
    searchBuses,
    getSeatsBySchedule,
    reserveSeats,
    getReservationsByUsername,
} = require('../controllers/CommuterController');
const authMiddleware = require('../middleware/authMiddleware');
const commuterMiddleware = require('../middleware/commuterMiddleware')

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
 *         description: List of matching buses with seat availability.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userSelected:
 *                   type: object
 *                   properties:
 *                     departurePoint:
 *                       type: string
 *                       example: "Colombo"
 *                     arrivalPoint:
 *                       type: string
 *                       example: "Kurunegala"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-31"
 *                 availableBuses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       route:
 *                         type: object
 *                         properties:
 *                           routeNumber:
 *                             type: string
 *                             example: "1587"
 *                           routeName:
 *                             type: string
 *                             example: "Colombo to Kurunegala"
 *                       bus:
 *                         type: object
 *                         properties:
 *                           registrationNumber:
 *                             type: string
 *                             example: "WP-XYZ-1234"
 *                           operatorName:
 *                             type: string
 *                             example: "ABC Travels"
 *                           busType:
 *                             type: string
 *                             example: "Semi Luxury"
 *                           ticketPrice:
 *                             type: number
 *                             example: 1500
 *                           capacity:
 *                             type: number
 *                             example: 45
 *                           availableSeats:
 *                             type: string
 *                             example: "7/45"
 *                       schedule:
 *                         type: object
 *                         properties:
 *                           departurePoint:
 *                             type: string
 *                             example: "Colombo"
 *                           departureTime:
 *                             type: string
 *                             example: "2024-12-30T08:00:00Z"
 *                           arrivalPoint:
 *                             type: string
 *                             example: "Kurunegala"
 *                           arrivalTime:
 *                             type: string
 *                             example: "2024-12-30T11:00:00Z"
 *                           stops:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: "Kadawatha"
 *                       scheduleValid:
 *                         type: object
 *                         properties:
 *                           startDate:
 *                             type: string
 *                             format: date
 *                             example: "2024-12-01"
 *                           endDate:
 *                             type: string
 *                             format: date
 *                             example: "2024-12-31"
 *                       scheduleToken:
 *                         type: string
 *                         example: "15/67WP-XYZ-123420241231-ColomboKurunegala"
 *                       status:
 *                         type: string
 *                         example: "Available"
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
router.get('/searchbus', authMiddleware, searchBuses);

// Fetch seat layout by schedule ID
/**
 * @swagger
 * /api/commuter/seats/{scheduleId}:
 *   get:
 *     summary: Fetch seat layout with statuses for a specific schedule.
 *     tags: [Commuters]
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID to fetch seat statuses.
 *     responses:
 *       200:
 *         description: List of seats with statuses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   seatNumber:
 *                     type: number
 *                     example: 1
 *                   status:
 *                     type: string
 *                     example: "Available"
 *                   gender:
 *                     type: string
 *                     example: "M"
 *       404:
 *         description: Schedule not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No seats found for this schedule."
 */
router.get('/seats/:scheduleId', authMiddleware, getSeatsBySchedule);

// Reserve seats

/**
 * @swagger
 * /api/commuter/reserve:
 *   post:
 *     summary: Reserve seats for a commuter in a bus schedule.
 *     tags: [Commuters]
 *     security:
 *       - bearerAuth: [] # Use JWT for authentication
 *     parameters:
 *       - in: query
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique schedule identifier (scheduleToken).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passengerName:
 *                 type: string
 *                 example: "John Doe"
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: "Male"
 *               mobileNumber:
 *                 type: string
 *                 example: "0771234567"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               boardingPlace:
 *                 type: string
 *                 example: "Colombo"
 *               destinationPlace:
 *                 type: string
 *                 example: "Kurunegala"
 *               seats:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of seat numbers to be reserved.
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Reservation was successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation successful."
 *                 reservationId:
 *                   type: string
 *                   example: "240104-ColombotoKurunegala-AB1234-1-2-3"
 *       400:
 *         description: Some seats are already reserved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some seats are already reserved."
 *                 unavailableSeats:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [2, 3]
 *       404:
 *         description: Schedule not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post('/reserve', authMiddleware, reserveSeats);


// Get reservations by username

/**
 * @swagger
 * /api/commuter/reservations:
 *   get:
 *     summary: Retrieve all reservations for the authenticated user.
 *     tags: [Commuters]
 *     security:
 *       - bearerAuth: []  # Assumes you are using a Bearer token for authentication
 *     responses:
 *       200:
 *         description: List of reservations for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64bfc8cd43a10b0f2a456789"
 *                   username:
 *                     type: string
 *                     example: "user@example.com"
 *                   busDetails:
 *                     type: object
 *                     properties:
 *                       registrationNumber:
 *                         type: string
 *                         example: "WP-ABC-1234"
 *                       routeName:
 *                         type: string
 *                         example: "Colombo to Kurunegala"
 *                       departureTime:
 *                         type: string
 *                         example: "2025-01-10T08:00:00Z"
 *                   seats:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "A1"
 *                   totalPrice:
 *                     type: number
 *                     example: 1500
 *                   reservationDate:
 *                     type: string
 *                     example: "2025-01-05T10:00:00Z"
 *       400:
 *         description: User email not found in request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User email not found in request."
 *       404:
 *         description: No reservations found for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No reservations found for this user."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get('/reservations', authMiddleware, getReservationsByUsername);


module.exports = router;