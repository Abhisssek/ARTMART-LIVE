const { addNewAuctionItem, getAllAuctions, getAuctionDetails, getMyAuctions, removeAuction, republishAuction } = require("../controllers/auctionController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const checkCommissionStatus = require("../middleware/trackCommissionStatus");


router.post("/new", isAuthenticatedUser, authorizeRoles("auctioneer"),checkCommissionStatus, addNewAuctionItem);
router.get("/allitems", getAllAuctions);
router.get("/myauctions", isAuthenticatedUser, authorizeRoles("auctioneer"), getMyAuctions);
router.get("/:id", getAuctionDetails);
router.delete("/delete/:id", isAuthenticatedUser, authorizeRoles("auctioneer"), removeAuction);
router.put("/republish/:id", isAuthenticatedUser, authorizeRoles("auctioneer"), republishAuction);





module.exports = router;