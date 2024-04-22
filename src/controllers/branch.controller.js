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

  await Branch.create(branchObj);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Branch created successfully',
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

  branch = await Branch.findByIdAndUpdate(branchId, req.body, {
    new: true,
  });

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

  Branch.findByIdAndDelete(branchId).then(() => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Branch deleted successfully',
    });
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

  const driver = await Driver.create(driverObj);

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

  await branch.save().then((data) => {
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
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

  await branch.save().then((data) => {
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  });
});

// GET /:branchId/populate
exports.getBranchByIdPopulated = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  await Branch.findById(branchId)
    .populate('drivers')
    .populate('vehicles')
    .populate('routes')
    .then((data) => {
      res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    });
});

// GET /:branchId/drivers
exports.getDriversForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  await Branch.findById(branchId)
    .populate('drivers')
    .then((data) => {
      res.status(StatusCodes.OK).json({
        success: true,
        data: data.drivers,
      });
    });
});

// GET /:branchId/vehicles
exports.getVehiclesForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.branchId;

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  await Branch.findById(branchId)
    .populate('vehicles')
    .then((data) => {
      res.status(StatusCodes.OK).json({
        success: true,
        data: data.vehicles,
      });
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
    route,
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

  Route.findById(routeId).then((data) => {
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
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

  await Route.findByIdAndDelete(routeId);

  branch.routes.filter((routeItem) => routeItem._id !== route._id);

  branch.save().then(() => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Route deleted successfully',
    });
  });
});

// POST /:branchId/drivers/:driverId/schedules/create
exports.createSchedule = catchAsyncErrors(async (req, res, next) => {
  const { branchId, driverId } = req.params;
  const scheduleObj = req.body;

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  const driver = await Driver.findById(driverId);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  const schedule = await Schedule.create(scheduleObj);

  driver.assignedSchedule = schedule._id;

  driver.save();

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Schedule created and assigned successfully',
    data: schedule,
  });
});

// GET /:branchId/drivers/:driverId/schedule
exports.getSchedule = catchAsyncErrors(async (req, res, next) => {
  const { driverId } = req.params;

  const driver = await Driver.findById(driverId).populate('assignedSchedule');

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    data: driver.assignedSchedule,
  });
});

// PUT /:branchId/drivers/:driverId/schedule
exports.updateSchedule = catchAsyncErrors(async (req, res, next) => {
  const { driverId } = req.params;
  const scheduleObj = req.body;

  const driver = await Driver.findById(driverId);

  if (!driver) {
    return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
  }

  if (!driver.assignedSchedule) {
    return next(
      new ErrorHandler('Schedule not created for driver', StatusCodes.NOT_FOUND)
    );
  }

  const schedule = await Schedule.findById(driver.assignedSchedule);

  Object.assign(schedule, scheduleObj);

  schedule.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'Schedule updated successfully',
  });
});
