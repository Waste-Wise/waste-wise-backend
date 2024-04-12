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
const { isAuthenticated, isAuthorizedAdmin } = require('../../middleware/auth');

const router = express.Router();

router.route('/create').post(createBranch);
router.route('/').get(getAllBranches);
router
  .route('/:id')
  .get(getBranchById)
  .patch(updatebranchById)
  .delete(deleteBranchById);
router
  .route('/:id/drivers/create')
  .post(isAuthenticated, isAuthorizedAdmin, createDriverForBranch);
router
  .route('/:id/vehicles/create')
  .post(isAuthenticated, isAuthorizedAdmin, createVehicleForBranch);
router
  .route('/:id/populate')
  .get(isAuthenticated, isAuthorizedAdmin, getBranchByIdPopulated);
router
  .route('/:id/drivers')
  .get(isAuthenticated, isAuthorizedAdmin, getDriversForBranch);
router
  .route('/:id/vehicles')
  .get(isAuthenticated, isAuthorizedAdmin, getVehiclesForBranch);
router.route('/:branchId/assign-admin/:adminId').put(assignAdminToBranch);
router.route('/:id/unassign-admin').delete(unassignAdminFromBranch);

router.route('/:id/routes/create').post(createRoute);
router.route('/:id/routes').get(getAllRoutes);
router
  .route('/:branchId/routes/:routeId')
  .get(getRouteById)
  .put(updateRouteById)
  .delete(deleteRouteById);

module.exports = router;
