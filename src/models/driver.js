const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
    assignedVehicle: {
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
      select: false,
    },
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 10); // salt rounds: 10
});

driverSchema.methods.getJwt = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      name: this.name,
      email: this.email,
      isVerified: this.isVerified
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
    }
  );
};

driverSchema.methods.getRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
  });
};

driverSchema.methods.comparePasswords = async function (plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password);
};


module.exports = mongoose.model('Driver', driverSchema);
