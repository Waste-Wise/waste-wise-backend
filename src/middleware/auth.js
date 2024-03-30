const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const Branch = require('../models/branch');

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

exports.isAuthorizedAdmin = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new ErrorHandler(
        `${req.user.role} Not allowed to access this resource`,
        StatusCodes.FORBIDDEN
      )
    ); // forbid user
  }

  const id = req.params.id;

  const branch = await Branch.findById(id);

  const isAdminAssigned = branch.assignedAdmin == req.user._id;

  if (!isAdminAssigned) {
    return next(
      new ErrorHandler(
        `Not allowed to access this resource`,
        StatusCodes.FORBIDDEN
      )
    ); // forbid user
  }
  next();
});
