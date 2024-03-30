const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

// authenticate user by bearer token
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(
      new ErrorHandler(
        'Please login to access this resource',
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  const token = authHeader?.split(' ')[1];

  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Invalid token'
            })
        }
        
        req.user = decoded;
        next();
      });
  }
  else {
    res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized'
    });
  }

});

exports.isAuthorizedAdmin = () => {
  return (req, res, next) => {
    const branchId = req.params.branchId;

    

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role '${req.user.role}' is not allowed to access this resource`,
          StatusCodes.FORBIDDEN
        )
      ); // forbid user
    }

    next();
  };
};