const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Admin = require('../models/admin');

// GET /
exports.getAllAdmins = catchAsyncErrors(async (req, res, next) => {
  Admin.find().then((data) => {
    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  });
});

// GET /:id
exports.getAdminById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const admin = await Admin.findById(id).select('+password');


  if (!admin) {
    return next(new ErrorHandler('Admin not found', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    admin,
  });
});

// PATCH /:id
exports.updateAdminById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let admin = await Admin.findById(id);

  if (!admin) {
    return next(new ErrorHandler('Admin not found', StatusCodes.NOT_FOUND));
  }

  admin = await Admin.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    admin,
  });
});

// hard delete => DELETE /:id
exports.deleteAdminById = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const admin = await Admin.findById(id);

  if (!admin) {
    return next(new ErrorHandler('Admin not found', StatusCodes.NOT_FOUND));
  }

  Admin.findByIdAndDelete(id).then(() => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Admin deleted successfully',
    });
  });
});
