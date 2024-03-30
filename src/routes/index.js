const express = require('express');
const { StatusCodes } = require('http-status-codes');
const driverRouter = require('./driver.route');
const branchRouter = require('./branch.route');
const vehicleRouter = require('./vehicle.route');
const authRouter = require('./auth.route');
const adminRouter = require('./admin.route');

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
    path: '/admins',
    route: adminRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
