const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Admin = require('../modal/admin');
const ErrorHandler = require('../utils/ErrorHandler');

// Login user => /api/v1/auth/login
exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // retrieve user with password
    const user = await Admin.findOne({ email: email }).select('+password');
  
    if (!user) {
      return next(
        new ErrorHandler('Invalid email or password', StatusCodes.UNAUTHORIZED)
      );
    }
  
    // check password
    const isPasswordsMatched = await user.comparePasswords(password);
  
    if (!isPasswordsMatched) {
      return next(new ErrorHandler('Invalid password', StatusCodes.UNAUTHORIZED));
    }
  
    const token = user.getJwt();
  
    // send json web token as the response
    res.status(200).json({
      success: true,
      email,
      token,
    });
  });