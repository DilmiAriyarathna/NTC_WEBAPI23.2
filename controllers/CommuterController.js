const Schedule = require('../models/ScheduleModel');

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
        // Debug log for filter criteria
        console.log("Filter Criteria:", {
            departurePoint,
            arrivalPoint,
            date,
        });

        const buses = await Schedule.find({
            schedule: {
                $elemMatch: {
                    departurePoint: departurePoint.trim(),
                    arrivalPoint: arrivalPoint.trim(),
                },
            },
            "scheduleValid.startDate": { $lte: new Date(date) },
            "scheduleValid.endDate": { $gte: new Date(date) },
            isActive: true,
        });

        console.log("Fetched Buses:", buses); // Debug log for fetched buses

        // Handle no results found
        if (!buses || buses.length === 0) {
            console.log("No buses found for the specified criteria"); // Debug log for no results
            return res.status(404).json({ message: "No buses found for the specified criteria" });
        }

        // Return matching buses
        res.status(200).json(buses);
    } catch (error) {
        console.error("Error fetching buses:", error.message); // Debug log for errors
        res.status(500).json({ message: "Error fetching buses", error: error.message });
    }
};
