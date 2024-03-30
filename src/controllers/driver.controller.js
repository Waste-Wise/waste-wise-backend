const { StatusCodes } = require('http-status-codes');
const Driver = require('../models/driver');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Vehicle = require('../models/vehicle');

// POST /create
exports.createDriver = catchAsyncErrors(async (req, res, next) => {
  const { empNum, name, email, nic, mobileNumber, password, avatar } = req.body;

  const driverObj = {
    empNum,
    name,
    email,
    nic,
    mobileNumber,
    password,
    avatar,
    assignedRoute
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

// PUT /:driverId/assign/:vehicleId
exports.assignVehicleToDriver = catchAsyncErrors(async (req, res, next) => {
  const {driverId, vehicleId} = req.params;

  const driver = await Driver.findById(driverId);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  if(vehicle.isDriverAssigned) {
    return next(new ErrorHandler('Vehicle already assigned', StatusCodes.CONFLICT));
  }

  const previousAssignedVehicle = driver.asssignedVehicle;

  if(previousAssignedVehicle) {
    await Vehicle.findOneAndUpdate({_id: previousAssignedVehicle._id}, {isDriverAssigned: false});
  }

  driver.asssignedVehicle = vehicle._id;
  vehicle.isDriverAssigned = true;

  await driver.save();
  await vehicle.save();

  res.status(StatusCodes.OK).json({
    status: true,
    message: 'Driver assigned the vehicle successfully'
  });
});

// DELETE /:id/unassign
exports.unassignVehicle = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const driver = await Driver.findById(id);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  if(!driver.asssignedVehicle) {
    return next(new ErrorHandler('Vehicle is not assigned to the driver', StatusCodes.CONFLICT));
  }

  await Vehicle.findOneAndUpdate({_id: driver.asssignedVehicle._id}, {isDriverAssigned: false});

  driver.asssignedVehicle = null;

  await driver.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle unassigned successfully'
  });
});