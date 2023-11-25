const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authenticate');

const expenseController = require('../controllers/expenseController.js');
router.post('/addexpense', authentication.authenticate, expenseController.addexpense); 
router.post('/deleteexpense',authentication.authenticate,expenseController.deleteexpense);
router.get('/getexpenses',authentication.authenticate,  expenseController.getexpenses);


router.get('/download', authentication.authenticate, expenseController.downloadexpense);


module.exports = router;                                                                                                
