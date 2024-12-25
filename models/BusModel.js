// models/Bus.js
const mongoose = require('mongoose');

//function to extract last two digits of a number in Node
const getLastTwoDigits = (number) => {
    return number.toString().slice(-2);
};

const busSchema = new mongoose.Schema({
    busId: {
        type: String,
        unique: true
      },
      busNumber: {
        type: String,
        required: true,
        unique: true
      },
      driverName: {
        type: String,
        required: true
      },
      capacity: {
        type: Number,
        required: true
      },
      registrationNumber: {
        type: String,
        required: true,
        unique: true
      },
      routeNumber: {
        type: String, // Human-readable route number
        required: true,
      },
      isAvailable: {
        type: Boolean,
        default: true // Defaults to true (bus is available)
      }
    }, { timestamps: true });

//Pre-SAVE : To generate busId automatically
busSchema.pre('save', function(next){
    //Get: Current year and extract last two digits
    const currentYear = new Date().getFullYear();
    const lastTwoDigitsYear = currentYear.toString().slice(-2);

    //EXTRACT: last two digits from vehicle number
    const lastTwoDigitsNumber = getLastTwoDigits(this.registrationNumber);

    //Combine both and GENERATE BusID
    this.busId = `${lastTwoDigitsYear}0${lastTwoDigitsNumber}`;

    next();
});

module.exports = mongoose.model('Bus', busSchema);
