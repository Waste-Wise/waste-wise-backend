const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Admin = require('../models/admin');
const ErrorHandler = require('../utils/ErrorHandler');

// POST /admin/login
exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Admin.findOne({ email: email }).select('+password');

  if (!user) {
    return next(
      new ErrorHandler('Invalid email or password', StatusCodes.UNAUTHORIZED)
    );
  }

  const isPasswordsMatched = await user.comparePasswords(password);

  if (!isPasswordsMatched) {
    return next(new ErrorHandler('Invalid password', StatusCodes.UNAUTHORIZED));
  }

  const token = user.getJwt();

  res.status(200).json({
    success: true,
    token,
  });
});

// POST /admin/create
exports.adminCreate = catchAsyncErrors(async (req, res, next) => {
  const adminObj = {
    name: req.body.name,
    email: req.body.email,
    nic: req.body.nic,
    mobileNumber: req.body.mobileNumber,
    password: req.body.password,
  };

  const admin = await Admin.create(adminObj);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Admin created successfully',
  });
});
