const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');

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
    data: driver,
  });
});

// PATCH /:id
exports.updateDriverById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const driver = await Driver.findById(id);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  Object.assign(driver, req.body);

  await driver.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: driver,
  });
});

// hard delete => DELETE /:id
exports.deleteDriverById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const driver = await Driver.findById(id);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  await driver.deleteOne();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Driver deleted successfully',
  });
});

// PUT /:driverId/assign/:vehicleId
exports.assignVehicleToDriver = catchAsyncErrors(async (req, res, next) => {
  const { driverId, vehicleId } = req.params;

  const driver = await Driver.findById(driverId);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  if (vehicle.isDriverAssigned) {
    return next(
      new ErrorHandler('Vehicle already assigned', StatusCodes.CONFLICT)
    );
  }

  const previouslyAssignedVehicle = driver.assignedVehicle;

  if (previouslyAssignedVehicle) {
    await Vehicle.findByIdAndUpdate(previouslyAssignedVehicle._id, {
      isDriverAssigned: false,
    });
  }

  driver.assignedVehicle = vehicle._id;
  vehicle.isDriverAssigned = true;

  await driver.save();
  await vehicle.save();

  res.status(StatusCodes.OK).json({
    status: true,
    message: 'Driver assigned the vehicle successfully',
  });
});

// DELETE /:id/unassign
exports.unassignVehicle = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const driver = await Driver.findById(id);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  if (!driver.assignedVehicle) {
    return next(
      new ErrorHandler(
        'Vehicle is not assigned to the driver',
        StatusCodes.CONFLICT
      )
    );
  }

  await Vehicle.findByIdAndUpdate(driver.assignedVehicle._id, {
    isDriverAssigned: false,
  });

  driver.assignedVehicle = undefined;

  await driver.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle unassigned successfully',
  });
});

// GET /test
exports.testController = catchAsyncErrors(async (req, res, next) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Driver is verified',
  });
});
