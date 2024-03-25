const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      maxLength: [100, 'User name can not exceed 100 characters'],
    },
    drivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
      },
    ],
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Branch', branchSchema);
