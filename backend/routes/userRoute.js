const  {register, login, logout, updateUserProfile, updatePassword, addNotifyUser, getnotification, deleteNotification, checkAuctionResult, getUserBiddedAuctions, getAnnouncements}  = require('../controllers/userController');

const express = require('express');
const route = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { getUserProfile, getAllUsers } = require("../controllers/userController");
const { getChats } = require('../controllers/chatController');
const { myPlacedBids, myBidAuctions } = require('../controllers/bidController');


route.post('/register', register);
route.post('/login', login);
route.get('/logout', logout);
route.get('/profile', isAuthenticatedUser, getUserProfile);
// route.get('/allusers', isAuthenticatedUser, getAllUsers);
route.put('/profile/update', isAuthenticatedUser, updateUserProfile);
route.put('/password/update', isAuthenticatedUser, updatePassword);
route.post('/notify/:id', isAuthenticatedUser, addNotifyUser);
route.get('/get-notification', isAuthenticatedUser, getnotification)
route.delete('/delete-notification/:id', isAuthenticatedUser, deleteNotification)
route.get('/get-chats', isAuthenticatedUser, getChats)
route.get('/my-placed-bids', isAuthenticatedUser, myPlacedBids);
route.get('/my-placed-auctions', isAuthenticatedUser, myBidAuctions);
route.get('/auction-results/:auctionId', isAuthenticatedUser, checkAuctionResult);
route.get('/my-bidded-auctions', isAuthenticatedUser, getUserBiddedAuctions);
route.get('/get-announcements', isAuthenticatedUser, getAnnouncements);


module.exports = route;
