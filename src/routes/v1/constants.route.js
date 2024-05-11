const express = require('express');
const {} = require('../../controllers/constants.controller');
const { getConstants } = require('../../controllers/constant.controller');

const router = express.Router();

router.route('/get').get(getConstants);

router.route('/driver/reset/request').post(resetPasswordRequestDriver);

module.exports = router;
