const express = require('express');
const {
	getAllTransactions,
	getTransactionById,
	deleteTransactionById,
} = require('../../controllers/transaction.controller');

const router = express.Router();

router.route('/').get(getAllTransactions);
router.route('/:transactionId').get(getTransactionById);
router.route('/:transactionId').delete(deleteTransactionById);

module.exports = router;
