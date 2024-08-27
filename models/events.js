const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true }, // The title of the event
    description: { type: String, required: true }, // Detailed description of the event
    date: { type: Date, required: true }, // The date of the event
    startTime: { type: String, required: true }, // Start time of the event (stored as string, e.g., "14:00")
    endTime: { type: String, required: true }, // End time of the event (stored as string, e.g., "16:00")
    category: { 
        type: String, 
        required: true, 
        enum: ['Home', 'Advocacy', 'Events', 'Outreach'], // The category of the event
        default: 'Events' // Default category
    },
    location: { 
        title: { type: String, required: true }, // Title or name of the location (e.g., "Central Park")
        address: { type: String, required: true }, // Full address in a universal format
        latitude: { type: Number, required: true }, // Latitude for the map view
        longitude: { type: Number, required: true } // Longitude for the map view
    },
    coverImage: { type: String, required: true }, // URL of the cover image for the event
    eventImages: [{ type: String }], // Array of URLs for additional event images
    refundPolicy: { 
        type: String, 
        required: true,
        enum: ['No Refunds', 'Partial Refunds', 'Full Refunds'], // Different refund policies
        default: 'No Refunds' // Default to 'No Refunds'
    },
    isActive: { type: Boolean, default: true }, // Whether the event is active
}, {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
