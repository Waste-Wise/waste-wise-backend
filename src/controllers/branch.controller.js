const { StatusCodes } = require('http-status-codes');
const Branch = require('../models/branch');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');

// POST /create
exports.createBranch = async (req, res, next) => {
  const { name } = req.body;

  const branchObj = {
    name,
  };

  Branch.create(branchObj)
    .then((data) => {
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Branch created successfully',
        data,
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Branch creation failed',
        error,
      });
    });
};

// GET /
exports.getAllBranches = async (req, res, next) => {
  Branch.find()
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
exports.getBranchById = async (req, res, next) => {
  const id = req.params.id;

  const branch = await Branch.findById(id).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    });
  });

  if (!branch) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Branch not found',
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    branch,
  });
};

// PATCH /:id
exports.updatebranchById = async (req, res, next) => {
  const id = req.params.id;

  let branch = await Branch.findById(id).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    });
  });

  if (!branch) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Driver not found',
    });
  }

  branch = await Branch.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    branch,
  });
};

// DELETE /:id
exports.deleteBranchById = async (req, res, next) => {
  const id = req.params.id;

  const branch = await Branch.findById(id).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    });
  });

  if (!branch) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Branch not found',
    });
  }

  Branch.findByIdAndDelete(id)
    .then(() => {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Branch deleted successfully',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Branch deletion failled',
        error,
      });
    });
};

// POST /:id/drivers/create
exports.createDriverForBranch = async (req, res, next) => {
  const branchId = req.params.id;

  const { empNum, name, email, nic, mobileNumber, password } = req.body;

  const driverObj = {
    empNum,
    name,
    email,
    nic,
    mobileNumber,
    password,
  };

  const branch = await Branch.findById(branchId).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    });
  });

  if (!branch) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Branch not found',
    });
  }

  const driver = await Driver.create(driverObj).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Driver creation failed',
      error,
    });
  });

  branch.drivers.push(driver._id);

  await branch
    .save()
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

// POST /:id/vehicles/create
exports.createVehicleForBranch = async (req, res, next) => {
  const branchId = req.params.id;

  const { number, type } = req.body;

  const vehicleObj = {
    number,
    type,
  };

  const branch = await Branch.findById(branchId).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    });
  });

  if (!branch) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Branch not found',
    });
  }

  const vehicle = await Vehicle.create(vehicleObj).catch((error) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Vehicle creation failed',
      error,
    });
  });

  branch.vehicles.push(vehicle._id);

  await branch
    .save()
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

// GET /:id/populate
exports.getBranchByIdPopulated = async (req, res, next) => {
  const branchId = req.params.id;

  const branch = await Branch.findById(branchId).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    });
  });

  if (!branch) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Branch not found',
    });
  }

  await Branch.findById(branchId)
    .populate('drivers')
    .populate('vehicles')
    .then((data) => {
      res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    })
    .catch((error) => {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      });
    });
};

// GET /:id/drivers
exports.getDriversForBranch = async (req, res, next) => {
  const branchId = req.params.id;

  const branch = await Branch.findById(branchId).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    });
  });

  if (!branch) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Branch not found',
    });
  }

  await Branch.findById(branchId)
    .populate('drivers')
    .then((data) => {
      res.status(StatusCodes.OK).json({
        success: true,
        data: data.drivers,
      });
    })
    .catch((error) => {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      });
    });
};

// GET /:id/vehicles
exports.getVehiclesForBranch = async (req, res, next) => {
  const branchId = req.params.id;

  const branch = await Branch.findById(branchId).catch((error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    });
  });

  if (!branch) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Branch not found',
    });
  }

  await Branch.findById(branchId)
    .populate('vehicles')
    .then((data) => {
      res.status(StatusCodes.OK).json({
        success: true,
        data: data.vehicles,
      });
    })
    .catch((error) => {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      });
    });
};
