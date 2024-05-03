const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const roles = require('../../config/role');

// authenticate user by bearer token
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return next(
			new ErrorHandler(
				'Please login to access this resource',
				StatusCodes.UNAUTHORIZED
			)
		);
	}

	const token = authHeader.split(' ')[1];

	if (!token) {
		return next(new ErrorHandler('Unauthorized', StatusCodes.UNAUTHORIZED));
	}

	let decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		return next(new ErrorHandler('Invalid token', StatusCodes.FORBIDDEN));
	}

	req.user = decoded;

	return next();
});

exports.isAuthorizedBranch = catchAsyncErrors(async (req, res, next) => {
	if (req.user.role !== roles.BRANCH_ROLE) {
		return next(
			new ErrorHandler(
				`${req.user.role} Not allowed to access this resource`,
				StatusCodes.FORBIDDEN
			)
		);
	}

	const { branchId } = req.params;

	/* eslint-disable no-underscore-dangle */
	if (req.user._id !== branchId) {
		return next(
			new ErrorHandler(
				`Not allowed to access this resource`,
				StatusCodes.FORBIDDEN
			)
		);
	}
	/* eslint-disable no-underscore-dangle */

	return next();
});

exports.isVerifiedDriver = catchAsyncErrors(async (req, res, next) => {
	if (req.user.role !== roles.DRIVER_ROLE) {
		return next(
			new ErrorHandler(
				`${req.user.role} Not allowed to access this resource`,
				StatusCodes.FORBIDDEN
			)
		); // forbid user
	}

	if (!req.user.isVerified) {
		return next(
			new ErrorHandler('Driver not verified', StatusCodes.UNAUTHORIZED)
		);
	}

	return next();
});
