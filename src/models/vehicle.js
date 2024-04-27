const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Vehicle number is required'],
      maxLength: [15, 'Vehicle number can not exceed 100 characters'],
      unique: true,
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      maxLength: [50, 'Vehicle type can not exceed 50 characters'],
    },
    isDriverAssigned: {
      type: Boolean,
      default: false
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
      default: null
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
