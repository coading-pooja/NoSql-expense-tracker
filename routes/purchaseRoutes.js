const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchaseController');
const userAuthenication = require('../middleware/authenticate');

router.get('/premiummembership', userAuthenication.authenticate, purchaseController.purchasePremium);
router.post('/updatetransactionstatus',userAuthenication.authenticate, purchaseController.updateTransactionStatus);
module.exports = router; 