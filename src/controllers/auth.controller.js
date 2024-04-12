const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Branch = require('../models/branch');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');

// POST /login
exports.login = catchAsyncErrors(async (req, res, next) => {
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
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const user = await Branch.findById(decoded._id);

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
