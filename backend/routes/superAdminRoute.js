const express = require('express');
const router = express.Router();

const { deleteAuctionItem, updateProofStatus, getAllPaymentProofs, getPaymentProofDetails, deletePaymentProof, fetchAllUsers, monthlyRevenue, getAllAuctioneer, getAllBidder, putSuspensionOnUser, deleteUser, getUserProfile, getUserProfileAdmin, deleteAllChats, unreadCount, markReadChat, makeAnnouncement, getAllAuctions, putBlacklistOnAuctions } = require('../controllers/superAdminController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { getAllUsers } = require('../controllers/userController');


router.delete('/auction/delete/:id',isAuthenticatedUser, authorizeRoles('admin'), deleteAuctionItem);
router.put('/paymentproof/status/update/:id',isAuthenticatedUser, authorizeRoles('admin'), updateProofStatus);
router.get('/paymentproofs',isAuthenticatedUser, authorizeRoles('admin'), getAllPaymentProofs);
router.get('/paymentproof/:id',isAuthenticatedUser, authorizeRoles('admin'), getPaymentProofDetails);
router.delete('/paymentproof/delete/:id',isAuthenticatedUser, authorizeRoles('admin'), deletePaymentProof);
router.get('/allusers',isAuthenticatedUser, authorizeRoles('admin'), fetchAllUsers);
router.get('/monthly-revenue',isAuthenticatedUser, authorizeRoles('admin'), monthlyRevenue);
router.get('/all-bidder',isAuthenticatedUser, authorizeRoles('admin'), getAllBidder);
router.get('/all-auctioneer',isAuthenticatedUser, authorizeRoles('admin'), getAllAuctioneer);
router.put('/update-isSuspended/:id',isAuthenticatedUser, authorizeRoles('admin'), putSuspensionOnUser)
router.get('/see-users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.delete('/delete-user/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
router.get('/user-profile/:id', isAuthenticatedUser, authorizeRoles('admin'), getUserProfileAdmin);
router.delete('/delete-all-chats', isAuthenticatedUser, authorizeRoles('admin'), deleteAllChats);
router.get("/unread-count/:role", isAuthenticatedUser, authorizeRoles('admin'), unreadCount);
router.put('/chat/mark-read', isAuthenticatedUser, authorizeRoles('admin'), markReadChat);
router.post('/make-announcement', isAuthenticatedUser, authorizeRoles('admin'),makeAnnouncement);
router.get('/all-auctions-admin', isAuthenticatedUser, authorizeRoles('admin'), getAllAuctions);
router.patch('/blacklist/:auctionId', isAuthenticatedUser, authorizeRoles('admin'), putBlacklistOnAuctions)




module.exports = router;