const express = require('express');
const { login, refreshAuth } = require('../../controllers/auth.controller');

const router = express.Router();

router.route('/login').post(login);
router.route('/refresh').post(refreshAuth);

module.exports = router;
