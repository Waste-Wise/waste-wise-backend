const { StatusCodes } = require('http-status-codes');
const Vehicle = require('../models/vehicle');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// POST /create
exports.createVehicle = catchAsyncErrors(async (req, res, next) => {
  const { number, type } = req.body;

  const vehicle = {
    number,
    type,
  };

  Vehicle.create(vehicle).then((data) => {
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Vehicle created successfully',
      data,
    });
  });
});

// GET /
exports.getAllVehicles = catchAsyncErrors(async (req, res, next) => {
  Vehicle.find().then((data) => {
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  });
});

// GET /:id
exports.getVehicleById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: vehicle,
  });
});

// PATCH /:id
exports.updateVehicleById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  Object.assign(vehicle, req.body);

  await vehicle.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: vehicle,
  });
});

// DELETE /:id
exports.deleteVehicleById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  Vehicle.findByIdAndDelete(id).then(() => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  });
});
