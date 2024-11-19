const mongoose = require('mongoose');

// Ride Schema definition
const rideGet = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // User ID ko reference bana rahe hain
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: false },  // Driver (optional)
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available' },  // Ride status
    price: { type: Number, required: true },
    date: { type: Date, required: true },

});

// Create a model for the Ride Schema
const Ride = mongoose.model('Ride', rideGet);

module.exports = Ride;
