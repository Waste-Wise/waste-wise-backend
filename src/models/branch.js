const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('../../config/role');

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      maxLength: [100, 'User name can not exceed 100 characters'],
    },
    role: {
      type: String,
      default: roles.BRANCH_ROLE,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password should not contain less than 8 characters'],
      select: false,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    schedules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
      },
    ],
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
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    routes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
      },
    ],
  },
  { timestamps: true }
);

branchSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 10); // salt rounds: 10
});

branchSchema.methods.getJwt = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      name: this.name,
      email: this.email,
      branchId: this.branchId,
      branchName: this.branchName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
    }
  );
};

branchSchema.methods.getRefreshToken = function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
  });
};

branchSchema.methods.comparePasswords = async function (plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password);
};

module.exports = mongoose.model('Branch', branchSchema);
