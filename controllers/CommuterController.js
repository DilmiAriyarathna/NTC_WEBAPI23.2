const Schedule = require('../models/ScheduleModel');
const SeatStatus = require('../models/SeatStatusModel');
const Reservation = require('../models/ReservationModel');

exports.searchBuses = async (req, res) => {
    // Debug log to inspect incoming query parameters
    console.log("Query Params:", req.query);

    const { departurePoint, arrivalPoint, date } = req.query;

    // Validate required parameters
    if (!departurePoint || !arrivalPoint || !date) {
        console.log("Missing query parameters:", { departurePoint, arrivalPoint, date }); // Debug log for missing parameters
        return res.status(400).json({ message: "Missing required query parameters: departurePoint, arrivalPoint, or date" });
    }

    try {
        const selectedDate = new Date(date);

        // Debug log for filter criteria
        console.log("Filter Criteria:", {
            departurePoint,
            arrivalPoint,
            date,
        });
        // Find matching schedules
        const buses = await Schedule.find({
            schedule: {
                $elemMatch: {
                    departurePoint: departurePoint.trim(),
                    arrivalPoint: arrivalPoint.trim(),
                },
            },
            "scheduleValid.startDate": { $lte: selectedDate },
            "scheduleValid.endDate": { $gte: selectedDate },
            isActive: true,
        });

        // Handle no results found
        if (!buses || buses.length === 0) {
            return res.status(404).json({
                message: "No buses found for the specified criteria",
                userSelected: {
                    departurePoint,
                    arrivalPoint,
                    date,
                },
            });
        }

        // Calculate seat availability and format the response
        const formattedBuses = await Promise.all(
            buses.map(async (bus) => {
                const matchingSchedule = bus.schedule.find(
                    (s) =>
                        s.departurePoint === departurePoint.trim() &&
                        s.arrivalPoint === arrivalPoint.trim()
                );

                // Fetch seat statuses for the schedule
                const seatStatus = await SeatStatus.findOne({ scheduleId: bus.scheduleToken });
                const unavailableSeats = seatStatus
                    ? seatStatus.seatUpdates.filter((seat) => seat.status === 'NotAvailable').length
                    : 0;

                const totalSeats = bus.bus.capacity;
                const availableSeats = totalSeats - unavailableSeats;

                return {
                    route: {
                        routeNumber: bus.route.routeNumber,
                        routeName: bus.route.routeName,
                    },
                    bus: {
                        registrationNumber: bus.bus.registrationNumber,
                        operatorName: bus.bus.operatorName,
                        busType: bus.bus.busType,
                        ticketPrice: bus.bus.ticketPrice,
                        capacity: totalSeats,
                        availableSeats: `${availableSeats}/${totalSeats}`,
                    },
                    schedule: {
                        departurePoint: matchingSchedule.departurePoint,
                        departureTime: matchingSchedule.departureTime,
                        arrivalPoint: matchingSchedule.arrivalPoint,
                        arrivalTime: matchingSchedule.arrivalTime,
                        stops: matchingSchedule.stops || [],
                    },
                    scheduleValid: {
                        startDate: bus.scheduleValid.startDate,
                        endDate: bus.scheduleValid.endDate,
                    },
                    scheduleToken: bus.scheduleToken,
                    status: availableSeats > 0 ? "Available" : "Sold Out",
                };
            })
        );

        res.status(200).json({
            userSelected: {
                departurePoint,
                arrivalPoint,
                date,
            },
            availableBuses: formattedBuses,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching buses",
            error: error.message,
        });
    }
};


// Fetch Seat Layout with Statuses
exports.getSeatsBySchedule = async (req, res) => {
    try {
      const { scheduleId } = req.params;
  
      // Fetch the schedule details to get the capacity
      const schedule = await Schedule.findOne({ scheduleToken: scheduleId });

      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found." });
      }
  
      const totalSeats = schedule.bus.capacity; // Get capacity from schedule details

      // Find seats by schedule ID
      const seatsFromDb = await SeatStatus.find({ scheduleId });

     // Create a map of seat statuses from the seatUpdates array
     const seatStatusMap = {};
     seatsFromDb.forEach((seatStatus) => {
         seatStatus.seatUpdates.forEach((update) => {
             seatStatusMap[update.seatNumber] = update; // Map each seat number to its status
         });
     });
  
      // Generate the full seat list with statuses
      const seatList = [];
      for (let seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
        if (seatStatusMap[seatNumber]) {
          // If the seat exists in the database, use its status
          seatList.push({
            seatNumber,
            status: seatStatusMap[seatNumber].status,
            gender: seatStatusMap[seatNumber].gender || null, // Include gender if applicable
          });
        } else {
          // If the seat is not in the database, mark it as "Available"
          seatList.push({
            seatNumber,
            status: "Available",
            gender: null, // No gender information for available seats
          });
        }
      }
  
      res.status(200).json(seatList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "ERROR 01: Internal server error." });
    }
  };
  
  exports.reserveSeats = async (req, res) => {
    try {

      // Extract logged-in username
    const username = req.user.email; // Assuming the username is attached to req.user by the authentication middleware.

      const { passengerName, gender, mobileNumber, email, boardingPlace, destinationPlace, seats } = req.body;
  
      const { scheduleId } = req.query; // Extract scheduleId from query params
      const schedule = await Schedule.findOne({ scheduleToken: scheduleId });
  
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found.' });
      }
  
     // Check if requested seats are already reserved
    const existingSeatStatus = await SeatStatus.findOne({ scheduleId });

    if (existingSeatStatus) {
      const unavailableSeats = existingSeatStatus.seatUpdates
        .filter((update) => seats.includes(update.seatNumber) && update.status === 'Reserved')
        .map((update) => update.seatNumber);

      if (unavailableSeats.length > 0) {
        return res.status(400).json({
          message: 'Some seats are already reserved.',
          unavailableSeats,
        });
      }
    }

  
          // Prepare seat updates
    const seatUpdates = seats.map((seatNumber) => ({
      seatNumber,
      status: 'Reserved',
    }));

    // Insert or update seat status for the schedule
    const updateResult = await SeatStatus.findOneAndUpdate(
      { scheduleId }, // Filter by scheduleId
      {
        $setOnInsert: {
          scheduleId,
          operatorName: 'N/A', // Since this is a commuter update
        },
        $push: {
          seatUpdates: { $each: seatUpdates }, // Add all the seats to the seatUpdates array
        },
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log('Seat status update result:', updateResult);
  
      // Generate custom reservationId
      const today = new Date();
      const reservationId = `${today.getFullYear().toString().slice(2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${schedule.route.routeNumber}-${schedule.bus.registrationNumber.slice(-4)}-${seats.join('-')}`;
  
      // Create reservation
      const reservation = new Reservation({
        username,
        passengerName,
        gender,
        mobileNumber,
        email,
        boardingPlace,
        destinationPlace,
        seats: seats.map((seatNumber) => ({ seatNumber, status: 'Reserved' })),
        scheduleId,
        ticketAmount: schedule.bus.ticketPrice * seats.length,
        reservationId, // Save custom ID here
      });
  
      await reservation.save();

  
      res.status(201).json({
        message: 'Reservation successful.',
        reservationId: reservation.reservationId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  

  // Get Reservations for a User
exports.getReservationsByUsername = async (req, res) => {
    try {
      const username = req.user.email; // Safely access operator's name
  
      if (!username) {
        return res.status(400).json({ message: "User email not found in request." });
      }
      
      // Find reservations by username
      const reservations = await Reservation.find({ username });
  
      if (!reservations || reservations.length === 0) {
        return res.status(404).json({ message: "No reservations found for this user." });
      }
  
      res.status(200).json(reservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

