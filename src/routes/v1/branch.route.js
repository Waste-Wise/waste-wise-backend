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
	createRoute,
	getRouteById,
	deleteRouteById,
	getAllRoutes,
	updateRouteById,
	createSchedule,
	getSchedule,
	updateSchedule,
	toggleDriverStatus,
	toggleVehicleStatus,
	toggleScheduleStatus,
	assignDriverToSchedule,
	unassignDriverFromSchedule,
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
	.route('/:branchId/drivers/:driverId/toggle-status')
	.put(isAuthenticated, isAuthorizedBranch, toggleDriverStatus);
router
	.route('/:branchId/vehicles')
	.get(isAuthenticated, isAuthorizedBranch, getVehiclesForBranch);
router
	.route('/:branchId/vehicles/:vehicleId/toggle-status')
	.put(isAuthenticated, isAuthorizedBranch, toggleVehicleStatus);

router.route('/:branchId/routes/create').post(createRoute);
router
	.route('/:branchId/routes/:routeId')
	.get(getRouteById)
	.put(updateRouteById)
	.delete(deleteRouteById);

router
	.route('/:branchId/schedules/create')
	.post(isAuthenticated, isAuthorizedBranch, createSchedule);
router
	.route('/:branchId/schedules/:scheduleId')
	.get(isAuthenticated, isAuthorizedBranch, getSchedule)
	.put(isAuthenticated, isAuthorizedBranch, updateSchedule);

router
	.route('/:branchId/schedules/:scheduleId/toggle-status')
	.put(isAuthenticated, isAuthorizedBranch, toggleScheduleStatus);

router
	.route('/:branchId/schedules/:scheduleId/assign-driver/:driverId')
	.post(isAuthenticated, isAuthorizedBranch, assignDriverToSchedule);

router
	.route('/:branchId/schedules/:scheduleId/unassign-driver')
	.delete(isAuthenticated, isAuthorizedBranch, unassignDriverFromSchedule);

router.route('');

module.exports = router;
