const express = require('express');
const driverRouter = require('./driver.route');
const branchRouter = require('./branch.route');
const vehicleRouter = require('./vehicle.route');
const authRouter = require('./auth.route');
const transactionRouter = require('./transaction.route');

const router = express.Router();

const routes = [
	{
		path: '/auth',
		route: authRouter,
	},
	{
		path: '/drivers',
		route: driverRouter,
	},
	{
		path: '/branches',
		route: branchRouter,
	},
	{
		path: '/vehicles',
		route: vehicleRouter,
	},
	{
		path: '/transactions',
		route: transactionRouter,
	},
];

routes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
