const express = require('express');
const router = express.Router();

const passwordController = require('../controllers/passwordController');
// http:127.0.0.1//3000/password/createNewPassword/${id}`

router.post('/forgotPasswordMail', passwordController.forgotPasswordMail);

router.get('/createNewPassword/:id',passwordController.createNewPassword);

router.post('/createNewPassword/:id', passwordController.postNewPassword)
  


module.exports = router;