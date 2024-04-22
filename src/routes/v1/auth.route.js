const express = require('express');
const {
  refreshAuth,
  branchLogin,
  driverLogin,
  resetPasswordDriver,
  resetPasswordRequestDriver,
} = require('../../controllers/auth.controller');

const router = express.Router();

router.route('/login').post(branchLogin);
router.route('/refresh').post(refreshAuth);
router.route('/driver/login').post(driverLogin);
router.route('/driver/reset').post(resetPasswordDriver);
router.route('/driver/reset/request').post(resetPasswordRequestDriver);

module.exports = router;
