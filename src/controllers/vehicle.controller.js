const { StatusCodes } = require('http-status-codes');
const Vehicle = require('../models/vehicle');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Position = require('../models/position');

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

  await vehicle.deleteOne();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle deleted successfully',
  });
});

// DELETE /:id/unassign-driver
exports.unassignDriver = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  vehicle.isDriverAssigned = false;

  await vehicle.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle freed successfully',
  });
});

// PUT /vehicles/:id/position
exports.assignPosition = catchAsyncErrors(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  const positionObj = {
    latitude,
    longitude,
  };

  const id = req.params.id;
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  const position = await Position.create(positionObj);

  vehicle.position = position;

  await vehicle.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Position assigned successfully',
  });
});

// GET /vehicles/:id/position
exports.getPosition = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id).populate('position');

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  if (!vehicle.position) {
    return next(
      new ErrorHandler('Position not assigned', StatusCodes.CONFLICT)
    );
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: vehicle.position,
  });
});

// DELETE /vehicles/:id/position
exports.unassignPosistion = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  vehicle.position = null;

  await vehicle.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Position unassigned successfully',
  });
});
