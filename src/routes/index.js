const express = require('express');
const { StatusCodes } = require('http-status-codes');
const driverRouter = require('./driver.route');
const branchRouter = require('./branch.route');
const vehicleRouter = require('./vehicle.route');

const router = express.Router();

const routes = [
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
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
