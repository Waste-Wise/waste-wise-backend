const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const roles = require('../../config/role');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const Branch = require('../models/branch');
const Driver = require('../models/driver');

// POST /login
exports.branchLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Branch.findOne({ email: email }).select('+password');

  if (!user) {
    return next(
      new ErrorHandler('Invalid email or password', StatusCodes.UNAUTHORIZED)
    );
  }

  const isPasswordsMatched = await user.comparePasswords(password);

  if (!isPasswordsMatched) {
    return next(new ErrorHandler('Invalid password', StatusCodes.UNAUTHORIZED));
  }

  const token = user.getJwt();

  const refresh_token = user.getRefreshToken();

  res.status(StatusCodes.OK).json({
    success: true,
    token,
    refresh_token,
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
      return next(new ErrorHandler('Invalid token', StatusCodes.FORBIDDEN));
    }

    let user = undefined;

    if (decoded.role === roles.BRANCH_ROLE) {
      user = await Branch.findById(decoded._id);
    }

    if (decoded.role === roles.DRIVER_ROLE) {
      user = await Driver.findById(decoded._id);
    }

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

// POST /driver/login
exports.driverLogin = catchAsyncErrors(async (req, res, next) => {
  const { mobileNumber, password } = req.body;

  const user = await Driver.findOne({ mobileNumber: mobileNumber }).select(
    '+password'
  );

  if (!user) {
    return next(
      new ErrorHandler('Invalid email or password', StatusCodes.UNAUTHORIZED)
    );
  }

  if (!user.status) {
    return next(
      new ErrorHandler(
        'Driver not permitted. Please contact the admin',
        StatusCodes.CONFLICT
      )
    );
  }

  const isPasswordsMatched = await user.comparePasswords(password);

  if (!isPasswordsMatched) {
    return next(new ErrorHandler('Invalid password', StatusCodes.UNAUTHORIZED));
  }

  const token = user.getJwt();

  const refresh_token = user.getRefreshToken();

  res.status(StatusCodes.OK).json({
    success: true,
    token,
    refresh_token,
  });
});

// POST /driver/reset/request
exports.resetPasswordRequestDriver = catchAsyncErrors(
  async (req, res, next) => {
    const { mobileNumber } = req.body;

    const user = await Driver.findOne({ mobileNumber: mobileNumber });

    if (!user) {
      return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
    }

    if (!user.status) {
      return next(
        new ErrorHandler(
          'Driver not permitted. Please contact the admin',
          StatusCodes.CONFLICT
        )
      );
    }

    user.isVerified = false;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset request success',
    });
  }
);

// POST /driver/reset
exports.resetPasswordDriver = catchAsyncErrors(async (req, res, next) => {
  const { mobileNumber, password, confirmationPassword } = req.body;

  if (!passwordsMatched(password, confirmationPassword)) {
    return next(
      new ErrorHandler('Passwords are not identical', StatusCodes.CONFLICT)
    );
  }

  const user = await Driver.findOne({ mobileNumber: mobileNumber });

  if (!user) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  if (!user.status) {
    return next(
      new ErrorHandler(
        'Driver not permitted. Please contact the admin',
        StatusCodes.CONFLICT
      )
    );
  }

  if (user.isVerified) {
    return next(
      new ErrorHandler(
        'Driver is already verified. Please request for password reset first',
        StatusCodes.CONFLICT
      )
    );
  }

  user.password = password;
  user.isVerified = true;

  await user.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'Password changed successfully',
  });
});

const passwordsMatched = (password, confirmationPassword) =>
  password === confirmationPassword;
