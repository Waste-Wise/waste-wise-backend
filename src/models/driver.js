const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('../../config/role');

const driverSchema = new mongoose.Schema(
	{
		empNum: {
			type: String,
			required: [true, 'Employee number is required'],
			maxLength: [20, 'Employee number max length exceeded'],
		},
		name: {
			type: String,
			required: [true, 'User name is required'],
			maxLength: [100, 'User name can not exceed 100 characters'],
		},
		email: {
			type: String,
		},
		nic: {
			type: String,
			required: [true, 'NIC is required'],
			unique: true,
		},
		mobileNumber: {
			type: String,
			required: [true, 'Mobile Number is required'],
			unique: true,
		},
		assignedVehicle: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vehicle',
		},
		role: {
			type: String,
			default: roles.DRIVER_ROLE,
		},
		password: {
			type: String,
			select: false,
			required: true,
		},
		avatar: {
			type: String,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		status: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

driverSchema.pre('save', async function save(next) {
	if (!this.isModified('password')) next();
	this.password = await bcrypt.hash(this.password, 10); // salt rounds: 10
});

driverSchema.methods.getJwt = function getJwt() {
	/* eslint-disable no-underscore-dangle */

	return jwt.sign(
		{
			_id: this._id,
			role: this.role,
			name: this.name,
			email: this.email,
			isVerified: this.isVerified,
			assignedVehicle: this.assignedVehicle,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
		}
	);
	/* eslint-enable no-underscore-dangle */
};

driverSchema.methods.getRefreshToken = function getRefreshToken() {
	/* eslint-disable no-underscore-dangle */
	return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
	});
	/* eslint-enable no-underscore-dangle */
};

driverSchema.methods.comparePasswords = function comparePasswords(
	plainTextPassword
) {
	return bcrypt.compare(plainTextPassword, this.password);
};

module.exports = mongoose.model('Driver', driverSchema);
