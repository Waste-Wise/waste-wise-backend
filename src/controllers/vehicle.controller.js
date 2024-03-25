const { StatusCodes } = require('http-status-codes');
const Vehicle = require('../models/vehicle');

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
        success: true,
        error,
      });
    });
};

// GET /:id
exports.getVehicleById = async (req, res, next) => {
  const id = req.params.id;

  const vehicle = await Vehicle.findById(id).catch((error) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).then((data) => {
      return res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    });
  });

  if (!vehicle) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Vehicle not found',
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    vehicle,
  });
};

// PATCH /:id
exports.updateVehicleById = async (req, res, next) => {
  const id = req.params.id;

  let vehicle = await Vehicle.findById(id).catch((error) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).then((data) => {
      return res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    });
  });

  if (!vehicle) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Vehicle not found',
    });
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

  const vehicle = await Vehicle.findById(id).catch((error) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).then((data) => {
      return res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    });
  });

  if (!vehicle) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Vehicle not found',
    });
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
        success: true,
        message: 'Vehicle deletion failled',
        error,
      });
    });
};
