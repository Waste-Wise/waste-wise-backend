const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    empNum: {
      type: String,
      required: [true, 'Employee number is required'],
      maxLength: [20, 'Employee number max length exceeded'],
    },
    name: {
      type: String,
      required: [true, 'User name is required'],
      maxLength: [100, 'User name can not exceed 100 characters'],
    },
    email: {
      type: String,
      unique: true,
    },
    nic: {
      type: String,
      required: [true, 'NIC is required'],
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile Number is required'],
      unique: true,
    },
    asssignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    assignedRoute: {
      type: String,
    },
    role: {
      type: String,
      default: 'driver',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password should not contain less than 8 characters'],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      uri: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
