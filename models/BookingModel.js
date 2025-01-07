const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  seatNumber: { type: Number, required: true },
  passengerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String },
  status: { type: String, enum: ['Pending Payment', 'Paid'], default: 'Pending Payment' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', BookingSchema);
