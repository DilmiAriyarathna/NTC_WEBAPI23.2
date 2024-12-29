// models/SheduleModel.js
const mongoose = require('mongoose');
const Route = require('./RouteModel'); // Import the Route model
const Bus = require('./BusModel'); // Import the Bus model

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
        registrationNumber: { 
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
      scheduleToken: {
        type: String,
        unique: true,
      },
},
      {
        timestamps: true, // Adds createdAt and updatedAt fields
});

// Middleware to validate route and bus before saving
sheduleSchema.pre('save', async function (next) {
    //validate Route availability and activation
    const routeExists = await Route.findOne({
        routeNumber: this.route.routeNumber,
        isActive: true, //Ensure route is in active status
    });
    if(!routeExists){
        return next(new Error('Selected route is not available or inactive. Please check!!'));
    }

    if (!this.scheduleToken) {
        // Extract route number and route name
        const routeNumber = this.route.routeNumber;
        const routeName = this.route.routeName.replace(/\s+/g, ''); // Remove spaces
    
        // Extract bus registration number
        const registrationNumber = this.bus.registrationNumber;
    
        // Extract schedule date (YYYYMMDD format)
        const scheduleDate = new Date(this.schedule[0].departureTime)
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, ''); // Format as YYYYMMDD
    
        // Generate the schedule token
        this.scheduleToken = `${routeNumber}${registrationNumber}${scheduleDate}-${routeName}`;
      }
      
    next();
});

module.exports = mongoose.model('Schedule', sheduleSchema);