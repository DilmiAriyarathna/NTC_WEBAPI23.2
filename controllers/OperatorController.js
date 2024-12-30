const Schedule = require('../models/ScheduleModel');
const Bus = require('../models/BusModel');
const SeatStatus = require('../models/SeatStatusModel');

// Add a new schedule
exports.addSchedule = async (req, res) => {
  try {
    const { route, bus, schedule, scheduleValid, isActive } = req.body;

    // Check if bus exists and is available
    const busRecord = await Bus.findOne({ registrationNumber: bus.registrationNumber });
    if (!busRecord || !busRecord.isAvailable) {
      return res.status(400).json({
        message: 'Selected bus is not available or inactive. Please check!!',
      });
    }

    // Create and save a new schedule
    const newSchedule = new Schedule({
      route,
      bus,
      schedule,
      scheduleValid,
      isActive,
    });

    await newSchedule.save(); // Pre-save validations in the model handle route and bus checks.

    res.status(201).json({
      message: 'Schedule added successfully',
      schedule: newSchedule,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to add schedule',
      error: error.message,
    });
  }
};

// Update a schedule using Shedule Token
exports.updateSchedule = async (req, res) => {
  try {
    const { scheduleToken } = req.params; // Extract scheduleToken from URL params
    const updates = req.body; // Get updates from request body
    const operatorName = req.user?.name; // Safely access operator's name

     // Check if operator's name is available
     if (!operatorName) {
        return res.status(401).json({
          message: 'Operator information is missing or unauthorized',
        });
      }

    // Find the schedule by scheduleToken
    const schedule = await Schedule.findOne({ scheduleToken });

    if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

       // Check if the schedule belongs to the logged-in operator
    if (schedule.bus.operatorName !== operatorName) {
        return res.status(403).json({
          message: 'You do not have permission to update this schedule',
        });
      }

    // // Allow updating only the schedule section
    // if (updates.schedule) {
    //     schedule.schedule = updates.schedule; // Replace the schedule section with the new data
    // } else {
    //     return res.status(400).json({
    //     message: 'Only the schedule section can be updated',
    //     });
    // }

    // Allow updating only the schedule section
    if (updates.schedule) {
        // Validate the schedule structure
        if (!Array.isArray(updates.schedule) || updates.schedule.length === 0) {
          return res.status(400).json({
            message: 'Invalid schedule data provided',
          });
        }
  
        schedule.schedule = updates.schedule; // Replace the schedule section with the new data
      } else {
        return res.status(400).json({
          message: 'Only the schedule section can be updated',
        });
      }

    // Save the updated schedule
    await schedule.save();

    res.status(200).json({
      message: 'Schedule updated successfully',
      schedule,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update schedule',
      error: error.message,
    });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { scheduleToken } = req.params;
    const operatorName = req.user?.name; // Safely access operator's name

     // Check if operator's name is available
     if (!operatorName) {
        return res.status(401).json({
          message: 'Operator information is missing or unauthorized',
        });
      }

    const schedule  = await Schedule.findOne({ scheduleToken });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.bus.operatorName !== operatorName) {
        return res.status(403).json({
          message: 'You do not have permission to update this schedule',
        });
      }

      // Delete the schedule
    await Schedule.findOneAndDelete({ scheduleToken });

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error to the console for debugging
    res.status(500).json({
      message: 'Failed to delete schedule',
      error: error.message,
    });
  }
};

// Get schedules for the operator
exports.getSchedulesByOperator = async (req, res) => {
  try {
    const operatorName = req.user?.name; // Safely access operator's name

    const schedules = await Schedule.find({ 'bus.operatorName': operatorName });

    res.status(200).json({ message: 'Schedules retrieved', schedules });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve schedules',
      error: error.message,
    });
  }
};


// Update seat statuses
exports.updateSeats = async (req, res) => {
  // const scheduleId = req.params.scheduleId; // Extract scheduleId from the URL parameter
  const { scheduleId } = req.params;
  const { seatUpdates, operatorName } = req.body;

  try {
    //console.log('Schedule ID:', scheduleId);

    // Find the schedule by scheduleToken
    const schedule = await Schedule.findOne({ scheduleToken: scheduleId });

    //console.log('Database query result:', schedule); // Debug database query result

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Ensure only the scheduled operator can update the seat statuses
    if (schedule.bus.operatorName !== operatorName) {
      return res.status(403).json({ message: 'You do not have permission to update this schedule.' });
    }

    // Find the existing seat status record
    let seatStatus = await SeatStatus.findOne({ scheduleId });


    if (!seatStatus) {
    // First-time insert
    seatStatus = new SeatStatus({
      scheduleId,
      seatUpdates,
      operatorName,
    });
  } else {
    // Update existing record: Merge seat updates
    seatUpdates.forEach((update) => {
      const existingSeat = seatStatus.seatUpdates.find(s => s.seatNumber === update.seatNumber);
      if (existingSeat) {
        // Update the existing seat status
        existingSeat.status = update.status;
      } else {
        // Add new seat update
        seatStatus.seatUpdates.push(update);
      }
    });
  }
    await seatStatus.save();

    res.json({ message: 'Seat statuses updated successfully', seatStatus  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get seat availability (merged with operator updates)
exports.getSeatAvailability = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const schedule = await Schedule.findOne({ scheduleToken: scheduleId });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const seatStatus = await SeatStatus.findOne({ scheduleId });

    const updatedSeats = seatStatus.seatUpdates.map((seat) => {
      const operatorSeat = seatStatus?.seatUpdates.find((s) => s.seatNumber === seat.seatNumber);
      return {
        seatNumber: seat.seatNumber,
        status: operatorSeat?.status || seat.status,
      };
    });

    res.json(updatedSeats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
