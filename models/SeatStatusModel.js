const mongoose = require('mongoose');

const SeatStatusSchema = new mongoose.Schema({
  scheduleId: { type: String, required: true }, // Reference to the bus schedule
  seatUpdates: [
    {
      seatNumber: { type: Number, required: true },
      status: { type: String, enum: ['Available', 'NotAvailable', 'NotProvided'], required: true },
    },
  ],
  operatorName: { type: String, required: true }, // For operator tracking
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SeatStatus', SeatStatusSchema);
