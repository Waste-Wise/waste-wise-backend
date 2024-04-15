const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const Branch = require('../models/branch');
const Driver = require('../models/driver');

// authenticate user by bearer token
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(
      new ErrorHandler(
        'Please login to access this resource',
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  const token = authHeader?.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Invalid token',
        });
      }

      req.user = decoded;
      next();
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized',
    });
  }
});

exports.isAuthorizedBranch = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== 'branch') {
    return next(
      new ErrorHandler(
        `${req.user.role} Not allowed to access this resource`,
        StatusCodes.FORBIDDEN
      )
    ); // forbid user
  }

  const branchId = req.params.branchId;

  if (req.user._id !== branchId) {
    return next(
      new ErrorHandler(
        `Not allowed to access this resource`,
        StatusCodes.FORBIDDEN
      )
    ); // forbid user
  }
  next();
});

exports.isVerifiedDriver = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== 'driver') {
    return next(
      new ErrorHandler(
        `${req.user.role} Not allowed to access this resource`,
        StatusCodes.FORBIDDEN
      )
    ); // forbid user
  }

  if (!req.user.isVerified) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Driver not verified',
    });
  }

  next();
});
