const express = require('express');
const { refreshAuth, branchLogin, driverLogin, resetPasswordDriver } = require('../../controllers/auth.controller');

const router = express.Router();

router.route('/login').post(branchLogin);
router.route('/refresh').post(refreshAuth);
router.route('/driver/login').post(driverLogin);
router.route('/driver/reset').post(resetPasswordDriver);

module.exports = router;
