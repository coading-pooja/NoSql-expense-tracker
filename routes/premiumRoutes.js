const express = require('express');

const premiumController = require('../controllers/premiumController');

const authMiddleware = require('../middleware/authenticate');

const router = express.Router();

router.get('/showLeaderboard', authMiddleware.authenticate, premiumController.getUserLeaderboard);

module.exports = router;