const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Vehicle number is required'],
      maxLength: [15, 'Vehicle number can not exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      maxLength: [50, 'Vehicle type can not exceed 50 characters'],
    },
    isDriverAssigned: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
