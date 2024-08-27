const Event = require('../models/events'); 

const eventController = {

    // Create a new event
    createEvent: async (req, res) => {
        try {
            // Destructure the required fields from the request body
            const { 
                title, 
                description, 
                date, 
                startTime, 
                endTime, 
                category, 
                location, 
                coverImage, 
                eventImages, 
                refundPolicy 
            } = req.body;

            // Ensure that the location object contains the necessary fields
            const { title: locationTitle, address, latitude, longitude } = location;

            // Create a new Event document
            const newEvent = new Event({
                title,
                description,
                date,
                startTime,
                endTime,
                category,
                location: {
                    title: locationTitle,
                    address,
                    latitude,
                    longitude
                },
                coverImage,
                eventImages,
                refundPolicy,
            });

            // Save the event to the database
            await newEvent.save();

            // Respond with the created event
            res.status(201).json({
                status: "OK",
                result: {
                    success: true,
                    message: "Event successfully created.",
                    event: newEvent
                }
            });

        } catch (error) {
            // Handle any errors during the process
            res.status(500).json({
                status: "Error",
                result: {
                    success: false,
                    message: "An error occurred while creating the event.",
                    error: error.message
                }
            });
        }
    },

    getEventsByCategory: async (req, res) => {
        try {
            const { category } = req.params; // Extract category from the route parameters

            // Find events that match the given category
            const events = await Event.find({ category });

            // If no events found, respond with a 404
            if (events.length === 0) {
                return res.status(201).json({
                    status: "OK",
                    result: {
                        success: false,
                        message: `No events found for category: ${category}`
                    }
                });
            }

            // Respond with the found events
            res.status(200).json({
                status: "OK",
                result: {
                    success: true,
                    message: "Events retrieved successfully.",
                    events: events
                }
            });

        } catch (error) {
            // Handle any errors during the process
            res.status(500).json({
                status: "Error",
                result: {
                    success: false,
                    message: "An error occurred while fetching the events.",
                    error: error.message
                }
            });
        }
    },


};

module.exports = eventController;
