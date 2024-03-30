const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const Branch = require('../models/branch');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const mongoose = require('mongoose');

// POST /create
exports.createBranch = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  const branchObj = {
    name,
  };

  Branch.create(branchObj).then((data) => {
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Branch created successfully',
      data,
    });
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

// GET /:id
exports.getBranchById = catchAsyncErrors(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    branch,
  });
});

// PATCH /:id
exports.updatebranchById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let branch = await Branch.findById(id);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  branch = await Branch.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    branch,
  });
});

// DELETE /:id
exports.deleteBranchById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const branch = await Branch.findById(id);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  Branch.findByIdAndDelete(id).then(() => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Branch deleted successfully',
    });
  });
});

// POST /:id/drivers/create
exports.createDriverForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.id;

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

// POST /:id/vehicles/create
exports.createVehicleForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.id;

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

// GET /:id/populate
exports.getBranchByIdPopulated = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.id;

  const branch = await Branch.findById(branchId);

  if (!branch) {
    return next(new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND));
  }

  await Branch.findById(branchId)
    .populate('drivers')
    .populate('vehicles')
    .then((data) => {
      res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    });
});

// GET /:id/drivers
exports.getDriversForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.id;

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

// GET /:id/vehicles
exports.getVehiclesForBranch = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.id;

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

// PUT /:branchId/assign-admin/:adminId
exports.assignAdminToBranch = catchAsyncErrors(async (req, res, next) => {
  const { branchId, adminId } = req.params;

  const branch = await Branch.findById(branchId);

  const adminObjectId = new mongoose.Types.ObjectId(adminId);

  branch.assignedAdmin = adminObjectId;

  await branch.save().then(() => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Admin assigned to branch successfully',
    });
  });
});

// DELETE /:id/unassign-admin
exports.unassignAdminFromBranch = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const branch = await Branch.findById(id);

  branch.assignedAdmin = null;

  await branch.save().then(() => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Admin unassigned successfully',
    });
  });
});
