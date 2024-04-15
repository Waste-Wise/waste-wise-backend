const express = require('express');
const {
  createBranch,
  getAllBranches,
  getBranchById,
  updatebranchById,
  deleteBranchById,
  createDriverForBranch,
  getBranchByIdPopulated,
  createVehicleForBranch,
  getDriversForBranch,
  getVehiclesForBranch,
  assignAdminToBranch,
  unassignAdminFromBranch,
  createRoute,
  getRouteById,
  deleteRouteById,
  getAllRoutes,
  updateRouteById,
} = require('../../controllers/branch.controller');
const {
  isAuthenticated,
  isAuthorizedBranch,
} = require('../../middleware/auth');

const router = express.Router();

router.route('/create').post(createBranch);
router.route('/').get(getAllBranches);

router.route('/routes').get(getAllRoutes);
router
  .route('/:branchId')
  .get(getBranchById)
  .patch(updatebranchById)
  .delete(deleteBranchById);
router
  .route('/:branchId/drivers/create')
  .post(isAuthenticated, isAuthorizedBranch, createDriverForBranch);
router
  .route('/:branchId/vehicles/create')
  .post(isAuthenticated, isAuthorizedBranch, createVehicleForBranch);
router
  .route('/:branchId/populate')
  .get(isAuthenticated, isAuthorizedBranch, getBranchByIdPopulated);
router
  .route('/:branchId/drivers')
  .get(isAuthenticated, isAuthorizedBranch, getDriversForBranch);
router
  .route('/:branchId/vehicles')
  .get(isAuthenticated, isAuthorizedBranch, getVehiclesForBranch);

router.route('/:branchId/routes/create').post(createRoute);
router
  .route('/:branchId/routes/:routeId')
  .get(getRouteById)
  .put(updateRouteById)
  .delete(deleteRouteById);

module.exports = router;
