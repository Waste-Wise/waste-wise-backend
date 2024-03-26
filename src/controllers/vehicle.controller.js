const { StatusCodes } = require('http-status-codes');
const Vehicle = require('../models/vehicle');
const ErrorHandler = require('../utils/ErrorHandler');

// POST /create
exports.createVehicle = async (req, res, next) => {
  const { number, type } = req.body;

  const vehicle = {
    number,
    type,
  };

  Vehicle.create(vehicle)
    .then((data) => {
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Vehicle created successfully',
        data,
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Vehicle creation failed',
        error,
      });
    });
};

// GET /
exports.getAllVehicles = async (req, res, next) => {
  Vehicle.find()
    .then((data) => {
      res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      });
    });
};

// GET /:id
exports.getVehicleById = async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    vehicle,
  });
};

// PATCH /:id
exports.updateVehicleById = async (req, res, next) => {
  const id = req.params.id;

  let vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  vehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    vehicle,
  });
};

// DELETE /:id
exports.deleteVehicleById = async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id)

  if (!vehicle) {
    return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
  }

  Vehicle.findByIdAndDelete(id)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Vehicle deletion failled',
        error,
      });
    });
};
