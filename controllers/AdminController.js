// controllers/AdminController.js
const Route = require('../models/RouteModel');
const Bus = require('../models/BusModel');

// Add a new route
exports.addRoute = async (req, res) => {
  const { routeNumber, startingPoint, endingPoint, distance } = req.body;

  try {    

    //create new route
    const newRoute = await Route.create({
        routeNumber, 
        startingPoint, 
        endingPoint, 
        distance, 
      });
    res.status(201).json({ message: 'Route added successfully', route: newRoute });
  } catch (error) {controllers/AdminController.js
    res.status(500).json({ message: 'Failed to add route', error: error.message });
  }
};

// Add a new bus
exports.addBus = async (req, res) => {
  const { busNumber, driverName, conductorName, operatorname, bustype, capacity, price, availableSeats, registrationNumber, routeNumber } = req.body;

  try {
    // Check if a bus with the same registrationNumber already exists
    const existingBus = await Bus.findOne({ registrationNumber });
    if (existingBus) {
      return res.status(400).json({ message: 'A bus with this registration number already exists' });
    }

    // // Check if the routeId exists in the Route collection
    // const routeExists = await Route.findById(routeId);
    // if (!routeExists) {
    //   return res.status(400).json({ message: 'Invalid route ID' });
    // }

     // Find the route by routeNumber
     const route = await Route.findOne({ routeNumber });
     if (!route) {
       return res.status(400).json({ message: 'Invalid route number' });
     }

    // Create a new bus
    const newBus = await Bus.create({
      busNumber,
      driverName,
      conductorName,
      operatorname,
      bustype,
      capacity,
      price,
      availableSeats,
      registrationNumber,
      routeNumber: route.routeNumber,
    });
    res.status(201).json({ message: 'Bus added successfully', bus: newBus });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add bus', error: error.message });
  }
};

// Get all routes
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch routes', error: error.message });
  }
};

// Get all buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch buses', error: error.message });
  }
};
