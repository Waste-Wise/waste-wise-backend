const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const Branch = require('../models/branch');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Route = require('../models/route');
const Schedule = require('../models/schedule');

// POST /create
exports.createBranch = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const branchObj = {
    name,
    email,
    password,
  };

  const branch = await Branch.create(branchObj);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Branch created successfully',
    data: branch,
  });
});

// GET /
exports.getAllBranches = catchAsyncErrors(async (req, res, next) => {
  Branch.find().then((data) => {
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  });
});

// GET /:branchId
exports.getBranchById = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;
  const branch = await Branch.findById(branchId).select('+password');

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: branch,
  });
});

// PATCH /:branchId
exports.updatebranchById = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  Object.assign(branch, req.body);

  await branch.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: branch,
  });
});

// DELETE /:branchId
exports.deleteBranchById = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  await branch.deleteOne();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Branch deleted successfully',
  });
});

// POST /:branchId/drivers/create
exports.createDriverForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const {
    empNum,
    name,
    email,
    nic,
    mobileNumber,
    password,
    avatar,
    assignedRoute,
    assignedVehicle,
  } = req.body;

  const driverObj = {
    empNum,
    name,
    email,
    nic,
    mobileNumber,
    password,
  };

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  if (avatar) {
    driverObj.avatar = avatar;
  }

  if (assignedRoute) {
    driverObj.assignedRoute = assignedRoute;
  }

  let driver = await Driver.create(driverObj);

  if (assignedVehicle) {
    const vehicleObjId = new mongoose.Types.ObjectId(assignedVehicle);

    const vehicle = await Vehicle.findById(vehicleObjId);

    if (!vehicle) {
      return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
    }

    if (vehicle.isDriverAssigned) {
      return next(
        new ErrorHandler('Vehicle already assigned', StatusCodes.CONFLICT)
      );
    }

    vehicle.isDriverAssigned = true;

    await vehicle.save();

    driver.assignedVehicle = vehicleObjId;

    await driver.save();
  }

  branch.drivers.push(driver._id);

  await branch.save();

  driver = await Driver.findById(driver._id);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: driver,
  });
});

// POST /:branchId/vehicles/create
exports.createVehicleForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const { number, type } = req.body;

  const vehicleObj = {
    number,
    type,
  };

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  const vehicle = await Vehicle.create(vehicleObj);

  branch.vehicles.push(vehicle._id);

  await branch.save();

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Vehicle added to branch successfully',
    data: vehicle,
  });
});

// GET /:branchId/populate
exports.getBranchByIdPopulated = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId)
    .populate('drivers')
    .populate('vehicles')
    .populate('routes')
    .populate('schedules');

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    success: true,
    data: branch,
  });
});

// GET /:branchId/drivers
exports.getDriversForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId).populate('drivers');

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: branch.drivers,
  });
});

// PUT /:branchId/drivers/:driverId/toggle-status
exports.toggleDriverStatus = catchAsyncErrors(async (req, res, next) => {
  const { branchId, driverId } = req.params;

  const branch = await Branch.findById(branchId).populate('drivers');

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  let driver = branch.drivers.find((driverItem) => driverItem.id === driverId);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  driver = await Driver.findById(driverId);

  driver.status = !driver.status;

  await driver.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: `Driver ${driver.status ? 'enabled' : 'disabled'}`,
  });
});

// GET /:branchId/vehicles
exports.getVehiclesForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId).populate('vehicles');

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: branch.vehicles,
  });
});

// POST /:branchId/routes/create
exports.createRoute = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId);

  const routeObj = req.body;

  const route = await Route.create(routeObj);

  branch.routes.push(route._id);

  await branch.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Route created successfully',
    data: route,
  });
});

// GET /routes
exports.getAllRoutes = catchAsyncErrors(async (req, res, next) => {
  Route.find().then((data) => {
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  });
});

// GET /:branchId/routes/:routeId
exports.getRouteById = catchAsyncErrors(async (req, res, next) => {
  const routeId = req.params.routeId;

  const route = await Route.findById(routeId);

  if (!route) {
    return next(new ErrorHandler('Route not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: route,
  });
});

// PUT /:branchId/routes/:routeId
exports.updateRouteById = catchAsyncErrors(async (req, res, next) => {
  const routeId = req.params.routeId;

  const route = await Route.findById(routeId);

  if (!route) {
    return next(new ErrorHandler('Route not found', StatusCodes.NOT_FOUND));
  }

  Object.assign(route, req.body);

  await route.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Route updated successfully',
  });
});

// DELETE /:branchId/routes/:routeId
exports.deleteRouteById = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;
  const routeId = req.params.routeId;

  const branch = await Branch.findById(branchId);
  const route = await Route.findById(routeId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  if (!route) {
    return next(new ErrorHandler('Route not found', StatusCodes.NOT_FOUND));
  }

  await route.deleteOne();

  branch.routes.filter((routeItem) => routeItem.id !== route.id);

  await branch.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Route deleted successfully',
  });
});

// POST /:branchId/schedules/create
exports.createSchedule = catchAsyncErrors(async (req, res, next) => {
  const { branchId } = req.params;
  const scheduleObj = req.body;

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  let schedule = await Schedule.create(scheduleObj);

  branch.schedules.push(schedule._id);

  await branch.save();

  schedule = await Schedule.findById(schedule._id);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Schedule created and assigned successfully',
    data: schedule,
  });
});

// GET /:branchId/schedules/:scheduleId
exports.getSchedule = catchAsyncErrors(async (req, res, next) => {
  const { scheduleId } = req.params;

  const schedule = await Schedule.findById(scheduleId);

  if (!schedule) {
    return next(new ErrorHandler('Schedule not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    data: schedule,
  });
});

// PUT /:branchId/schedules/:scheduleId
exports.updateSchedule = catchAsyncErrors(async (req, res, next) => {
  const { scheduleId } = req.params;
  const scheduleObj = req.body;

  const schedule = await Schedule.findById(scheduleId);

  if (!schedule) {
    return next(new ErrorHandler('Schedule not found', StatusCodes.NOT_FOUND));
  }

  Object.assign(schedule, scheduleObj);

  await schedule.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'Schedule updated successfully',
    data: schedule,
  });
});

// PUT /:branchId/schedules/:scheduleId/toggle-status
exports.toggleScheduleStatus = catchAsyncErrors(async (req, res, next) => {
  const { branchId, scheduleId } = req.params;

  const branch = await Branch.findById(branchId).populate('schedules');

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  let schedule = branch.schedules.find(
    (scheduleItem) => scheduleItem.id === scheduleId
  );

  if (!schedule) {
    return next(new ErrorHandler('Schedule not found', StatusCodes.NOT_FOUND));
  }

  schedule = await Schedule.findById(scheduleId);

  schedule.status = !schedule.status;

  await schedule.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: `Schedule ${schedule.status ? 'enabled' : 'disabled'}`,
  });
});

// POST /:branchId/schedules/:scheduleId/assign-driver/:driverId
exports.assignDriver = catchAsyncErrors(async (req, res, next) => {
  const { branchId, scheduleId, driverId } = req.params;

  const branch = await Branch.findById(branchId).populate('schedules');

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  let schedule = branch.schedules.find(
    (scheduleItem) => scheduleItem.id === scheduleId
  );

  if (!schedule) {
    return next(new ErrorHandler('Schedule not found', StatusCodes.NOT_FOUND));
  }

  if (schedule.assignedDriver) {
    return next(
      new ErrorHandler('Schedule is already assigned', StatusCodes.CONFLICT)
    );
  }

  const driver = await Driver.findById(driverId).populate('assignedVehicle');

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  if (!driver.status) {
    return next(new ErrorHandler('Driver is disabled', StatusCodes.CONFLICT));
  }

  if (!driver.isVerified) {
    return next(new ErrorHandler('Driver not verified', StatusCodes.CONFLICT));
  }

  if (!driver.assignedVehicle) {
    return next(
      new ErrorHandler('Driver has no vehicle assigned', StatusCodes.CONFLICT)
    );
  }

  if (!driver.assignedVehicle.status) {
    return next(
      new ErrorHandler('Assigned vehicle is disabled', StatusCodes.CONFLICT)
    );
  }

  schedule = await Schedule.findById(schedule._id);

  schedule.assignedDriver = driver.id;

  await schedule.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'Driver assigned successfully',
  });
});

// DELETE /:branchId/schedules/:scheduleId/unassign-driver
exports.unassignDriver = catchAsyncErrors(async (req, res, next) => {
  const { branchId, scheduleId } = req.params;

  const branch = await Branch.findById(branchId).populate('schedules');

  const schedule = await Schedule.findById(scheduleId);

  if (!schedule.assignedDriver) {
    return next(new ErrorHandler('Driver not assigned', StatusCodes.CONFLICT));
  }

  schedule.assignedDriver = undefined;

  await schedule.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'Driver unassigned successfully',
  });
});

// PUT /:branchId/vehicles/:vehicleId/toggle-status
exports.toggleVehicleStatus = catchAsyncErrors(async (req, res, next) => {
  const { branchId, vehicleId } = req.params;

  const branch = await Branch.findById(branchId).populate('vehicles');

  let vehicle = branch.vehicles.find(
    (vehicleItem) => vehicleItem.id === vehicleId
  );

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  vehicle = await Vehicle.findById(vehicleId);

  vehicle.status = !vehicle.status;

  await vehicle.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: `Vehicle ${vehicle.status ? 'enabled' : 'disabled'}`,
  });
});
