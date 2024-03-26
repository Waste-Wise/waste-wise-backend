const { StatusCodes } = require('http-status-codes');
const Driver = require('../models/driver');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// POST /create
exports.createDriver = catchAsyncErrors(async (req, res, next) => {
  const { empNum, name, email, nic, mobileNumber, password } = req.body;

  const driverObj = {
    empNum,
    name,
    email,
    nic,
    mobileNumber,
    password,
  };

  Driver.create(driverObj).then((data) => {
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Driver created successfully',
    });
  });
});

// GET /
exports.getAllDrivers = catchAsyncErrors(async (req, res, next) => {
  Driver.find().then((data) => {
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  });
});

// GET /:id
exports.getDriverById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const driver = await Driver.findById(id);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    driver,
  });
});

// PATCH /:id
exports.updateDriverById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let driver = await Driver.findById(id);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  driver = await Driver.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    driver,
  });
});

// hard delete => DELETE /:id
exports.deleteDriverById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const driver = await Driver.findById(id);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  Driver.findByIdAndDelete(id).then(() => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Driver deleted successfully',
    });
  });
});
