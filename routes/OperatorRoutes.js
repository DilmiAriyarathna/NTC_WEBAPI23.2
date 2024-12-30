const express = require('express');
const router = express.Router();
const {
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByOperator,
  updateSeats,
  getSeatAvailability,
} = require('../controllers/OperatorController');
const authMiddleware = require('../middleware/authMiddleware');
const operatorMiddleware = require('../middleware/operatorMiddleware');

/**
 * @swagger
 * /api/operator/schedules:
 *   post:
 *     summary: Add a new schedule
 *     tags: [Bus_Operator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               route:
 *                 type: object
 *                 properties:
 *                   routeNumber:
 *                     type: string
 *                     example: "1587"
 *                   routeName:
 *                     type: string
 *                     example: "Colombo to Kurunegala"
 *               bus:
 *                 type: object
 *                 properties:
 *                   registrationNumber:
 *                     type: string
 *                     example: "XYZ1234"
 *                   operatorName:
 *                     type: string
 *                     example: "John Doe"
 *                   busType:
 *                     type: string
 *                     example: "Luxury"
 *                   ticketPrice:
 *                     type: number
 *                     example: 120.5
 *                   capacity:
 *                     type: number
 *                     example: 40
 *                   availableSeats:
 *                     type: number
 *                     example: 30
 *               schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     departurePoint:
 *                       type: string
 *                       example: "Colombo"
 *                     departureTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-30T08:00:00Z"
 *                     arrivalPoint:
 *                       type: string
 *                       example: "Kurunegala"
 *                     arrivalTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-30T10:00:00Z"
 *                     stops:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Pannala"
 *               scheduleValid:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-12-30"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-01-15"
 *               scheduleToken:
 *                 type: string
 *                 unique: true
 *                 example: "1587XYZ123420241230-ColomboToKurunegala"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Schedule added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule created successfully"
 *                 schedule:
 *                   type: object
 *                   $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Failed to add schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to add schedule"
 *                 error:
 *                   type: string
 *                   example: "Bus is not available or inactive"
 */
router.post('/schedules', authMiddleware, operatorMiddleware, addSchedule);


/**
 * @swagger
 * /api/operator/schedules/{scheduleToken}:
 *   put:
 *     summary: Update a schedule by scheduleToken
 *     tags: [Bus_Operator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     departurePoint:
 *                       type: string
 *                     departureTime:
 *                       type: string
 *                     arrivalPoint:
 *                       type: string
 *                     arrivalTime:
 *                       type: string
 *                     stops:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Failed to update schedule
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Schedule not found
 */
router.put(
  '/schedules/:scheduleToken',
  authMiddleware,
  operatorMiddleware,
  updateSchedule
);

/**
 * @swagger
 * /api/operator/schedules/{scheduleToken}:
 *   delete:
 *     summary: Delete a schedule by its scheduleToken
 *     tags: [Bus_Operator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleToken
 *         required: true
 *         schema:
 *           type: string
 *           example: 1587XYZ123420241230-ColombotoKurunegala
 *         description: The unique token identifying the schedule to delete
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schedule deleted successfully
 *       401:
 *         description: Unauthorized or operator information is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Operator information is missing or unauthorized
 *       403:
 *         description: Operator does not have permission to delete this schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You do not have permission to delete this schedule
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schedule not found
 *       500:
 *         description: Failed to delete schedule due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete schedule
 *                 error:
 *                   type: string
 *                   example: Detailed error message here
 */
router.delete('/schedules/:scheduleToken', authMiddleware, operatorMiddleware, deleteSchedule);


/**
 * @swagger
 * /api/operator/schedules:
 *   get:
 *     summary: Get schedules by operator
 *     tags: [Bus_Operator]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
 *       400:
 *         description: Operator name is missing
 *       404:
 *         description: No schedules found for this operator
 *       500:
 *         description: Failed to retrieve schedules
 */
router.get('/schedules', authMiddleware, operatorMiddleware, getSchedulesByOperator);


/**
 * @swagger
 * /api/operator/schedules/{scheduleId}/update-seats:
 *   post:
 *     summary: Insert or update seat statuses for a bus schedule
 *     tags: [Bus_Operator]
 *     description: This endpoint allows the operator to insert or update seat availability for a specific schedule.
 *     parameters:
 *       - name: scheduleId
 *         in: path
 *         required: true
 *         type: string
 *         description: The schedule ID (scheduleToken) to update seat statuses for.
 *       - name: body
 *         in: body
 *         required: true
 *         description: The seat update details.
 *         schema:
 *           type: object
 *           properties:
 *             seatUpdates:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   seatNumber:
 *                     type: integer
 *                     description: The seat number being updated.
 *                     example: 1
 *                   status:
 *                     type: string
 *                     enum: [Available, NotAvailable, NotProvided]
 *                     description: The status of the seat.
 *                     example: NotAvailable
 *             operatorName:
 *               type: string
 *               description: The name of the operator performing the update.
 *               example: OperatorX
 *     responses:
 *       200:
 *         description: Seat statuses updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Seat statuses updated successfully'
 *                 seatStatus:
 *                   type: object
 *                   properties:
 *                     scheduleId:
 *                       type: string
 *                       example: '1587XYZ123420241230-ColombotoKurunegala'
 *                     seatUpdates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           seatNumber:
 *                             type: integer
 *                             example: 1
 *                           status:
 *                             type: string
 *                             example: NotAvailable
 *                     operatorName:
 *                       type: string
 *                       example: OperatorX
 *       400:
 *         description: Bad request, invalid data or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid request data'
 *       403:
 *         description: Operator does not have permission to update this schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'You do not have permission to update this schedule.'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Schedule not found'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.post('/schedules/:scheduleId/update-seats', authMiddleware, operatorMiddleware, updateSeats);
//router.post('/schedules/:scheduleId/update-seats', updateSeats);

// Get seat availability (with operator updates)

/**
 * @swagger
 * /api/operator/schedules/{scheduleId}/seats:
 *   get:
 *     summary: Get seat availability for a schedule
 *     description: Retrieve seat availability for a given schedule, including updates made by operators.
 *     tags: [Bus_Operator]
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         description: The unique identifier (scheduleToken) for the schedule.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved seat availability.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   seatNumber:
 *                     type: string
 *                     description: The seat number.
 *                   status:
 *                     type: string
 *                     description: The status of the seat (e.g., available, reserved).
 *       404:
 *         description: Schedule not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schedule not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.get('/schedules/:scheduleId/seats', authMiddleware, operatorMiddleware, getSeatAvailability);

module.exports = router;
