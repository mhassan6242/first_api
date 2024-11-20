const mongoose = require('mongoose');


const BookingSchema = new mongoose.Schema({
  driverId: {
    type:  mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: {
    type: String,
    required: true
  },
  orderStatus: {
    type: Boolean,
    required: false,
    default:false
  },
  cancelByUser: {
    type: Boolean,
    required: false,
    default:false
  },
  cancelByDriver: {
    type: Boolean,
    required: false,
    default:false
  },

  

});

module.exports = mongoose.model('booking', BookingSchema);


