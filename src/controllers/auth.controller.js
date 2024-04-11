const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Admin = require('../models/admin');
const Branch = require('../models/branch');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');

// POST /admin/login
exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Admin.findOne({ email: email }).select('+password');

  if (!user) {
    return next(
      new ErrorHandler('Invalid email or password', StatusCodes.UNAUTHORIZED)
    );
  }

  const isPasswordsMatched = await user.comparePasswords(password);

  if (!isPasswordsMatched) {
    return next(new ErrorHandler('Invalid password', StatusCodes.UNAUTHORIZED));
  }

  const adminId = new mongoose.Types.ObjectId(user._id);

  const branch = await Branch.findOne({ assignedAdmin: adminId });

  const token = user.getJwt(branch.id);

  const refresh_token = user.getRefreshToken();

  res.status(StatusCodes.OK).json({
    success: true,
    token,
    refresh_token,
  });
});

// POST /admin/create
exports.adminCreate = catchAsyncErrors(async (req, res, next) => {
  const adminObj = {
    name: req.body.name,
    email: req.body.email,
    nic: req.body.nic,
    mobileNumber: req.body.mobileNumber,
    password: req.body.password,
  };

  const admin = await Admin.create(adminObj);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Admin created successfully',
  });
});

// POST /refresh
exports.refreshAuth = catchAsyncErrors(async (req, res, next) => {
  const refresh_token = req.body.refresh_token;

  if (!refresh_token) {
    return next(
      new ErrorHandler('Refresh token not available', StatusCodes.BAD_REQUEST)
    );
  }

  jwt.verify(refresh_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const user = await Admin.findById(decoded._id);

    if (!user) {
      return next(new ErrorHandler('User not found', StatusCodes.NOT_FOUND));
    }

    const token = user.getJwt();

    const refresh_token = user.getRefreshToken();

    res.status(StatusCodes.OK).json({
      success: true,
      token,
      refresh_token,
    });
  });
});
