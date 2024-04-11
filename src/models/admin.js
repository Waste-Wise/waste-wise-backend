const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxLength: [100, 'Admin name can not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
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
    role: {
      type: String,
      default: 'admin',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password should not contain less than 8 characters'],
      select: false,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

// save prehook to hash the password before saving user
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 10); // salt rounds: 10
});

// retrieve jwt
adminSchema.methods.getJwt = function (branchId) {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      name: this.name,
      email: this.email,
      branchId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
    }
  );
};

// retrieve refresh token
adminSchema.methods.getRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
  });
};

adminSchema.methods.comparePasswords = async function (plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
