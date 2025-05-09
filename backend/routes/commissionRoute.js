const express = require('express');
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { proofOfCommission, getCommissionProof} = require('../controllers/commissionController');

router.post('/proof', isAuthenticatedUser, authorizeRoles('auctioneer'), proofOfCommission);
router.get('/my-proof', isAuthenticatedUser, authorizeRoles('auctioneer'), getCommissionProof);


module.exports = router;