// models/SheduleModel.js
const mongoose = require('mongoose');

const sheduleSchema = new mongoose.Schema({
    route: {
        routeNumber: {
            type: String, 
            required: true
        },
        routeName:{
            type: String,
            required: true
        },
    },
    bus: {
        busNumber: { 
            type: String,
            required: true
        },
        operatorName: { 
            type: String, 
            required: true 
        },
        busType: { 
            type: String, 
            required: true 
        },
        ticketPrice: { 
            type: Number, 
            required: true 
        },
        capacity: { 
            type: Number, 
            required: true 
        },
        availableSeats: { 
            type: Number, 
            required: true 
        },
    },
    schedule: [
        {
          departurePoint: { type: String, required: true }, // Point from the route
          departureTime: { type: String, required: true }, // Time added by operator
          arrivalPoint: { type: String, required: true }, // Point from the route
          arrivalTime: { type: String, required: true }, // Time added by operator
          stops: [{ type: String }], // List of stops
        },
      ],
      scheduleValid: {
        startDate: { 
            type: Date, 
            required: true 
        }, // Start of schedule validity
        endDate: { 
            type: Date, 
            required: true 
        }, // End of schedule validity
      },
      isActive: {
        type: Boolean,
        default: true, // Defaults to true if not specified
      },
},
      {
        timestamps: true, // Adds createdAt and updatedAt fields
});

// Middleware to validate route and bus before saving
sheduleSchema.pre('save', async function (next) {
    const Route = mongoose.model('RouteModel');
    const Bus = mongoose.model('BusModel');

    //validate Route availability and activation
    const routeExists = await Route.findOne({
        routeNumber: this.route.routeNumber,
        isActive: true, //Ensure route is in active status
    });
    if(!routeExists){
        return next(new Error('Selected route is not available or inactive. Please check!!'));
    }

    //validate Bus availability and activation
    const busExists = await Bus.findOne({
        busNumber: this.bus.busNumber,
        isActive: true,
        operatorName: this.bus.operatorName, //Ensure bus belongs to the operator
    });
    if(!busExists){
        return next(new Error('Selected bus is not available or inactive. Please check!!'));
    }

    next();
});

module.exports = mongoose.model('Schedule', sheduleSchema);