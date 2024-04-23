const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const Branch = require('../models/branch');
const Driver = require('../models/driver');
const roles = require('../../config/role');

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

  if (!token) {
    return next(new ErrorHandler('Unauthorized', StatusCodes.UNAUTHORIZED));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ErrorHandler('Invalid token', StatusCodes.FORBIDDEN));
    }

    req.user = decoded;
    next();
  });
});

exports.isAuthorizedBranch = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== roles.BRANCH_ROLE) {
    return next(
      new ErrorHandler(
        `${req.user.role} Not allowed to access this resource`,
        StatusCodes.FORBIDDEN
      )
    );
  }

  const branchId = req.params.branchId;

  if (req.user._id !== branchId) {
    return next(
      new ErrorHandler(
        `Not allowed to access this resource`,
        StatusCodes.FORBIDDEN
      )
    );
  }
  next();
});

exports.isVerifiedDriver = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== roles.DRIVER_ROLE) {
    return next(
      new ErrorHandler(
        `${req.user.role} Not allowed to access this resource`,
        StatusCodes.FORBIDDEN
      )
    ); // forbid user
  }

  if (!req.user.isVerified) {
    return next(
      new ErrorHandler('Driver not verified', StatusCodes.UNAUTHORIZED)
    );
  }

  next();
});
