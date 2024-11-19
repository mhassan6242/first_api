const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled', 'completed'],
    default: 'pending',
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid',
  },
});

module.exports = mongoose.model('Booking', BookingSchema);


