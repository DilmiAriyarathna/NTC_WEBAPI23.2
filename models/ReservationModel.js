const mongoose = require('mongoose');

// const ReservationSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   passengerName: { type: String, required: true },
//   gender: { type: String, enum: ['Male', 'Female'], required: true },
//   mobileNumber: { type: String, required: true },
//   email: { type: String },
//   boardingPlace: { type: String, required: true },
//   destinationPlace: { type: String, required: true },
//   seats: [{ seatNumber: Number, status: String }],
//   scheduleId: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

const ReservationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  passengerName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String },
  boardingPlace: { type: String, required: true },
  destinationPlace: { type: String, required: true },
  seats: [
    {
      seatNumber: { type: String, required: true }, // Alphanumeric seat numbers
      status: { type: String, required: true }, // E.g., "Reserved"
    },
  ],
  scheduleId: { type: String, required: true },  // Change this to String
  ticketAmount: { type: Number, required: true }, // Ticket price per seat
  reservationId: { type: String, unique: true, required: true }, // Formatted reservation ID
  createdAt: { type: Date, default: Date.now }, // Timestamp
});


module.exports = mongoose.model('Reservation', ReservationSchema);
