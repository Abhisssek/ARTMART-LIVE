const express = require('express');
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { placeBid } = require('../controllers/bidController');
const { checkAuctionEndTime } = require('../middleware/checkAuctionEndTime');


router.post('/place/:id', isAuthenticatedUser, authorizeRoles('bidder'),checkAuctionEndTime,  placeBid);


module.exports = router;