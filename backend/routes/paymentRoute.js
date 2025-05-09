const express = require("express");
const { createCheckoutSession } = require("../controllers/paymentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.post("/create-checkout-session",isAuthenticatedUser, authorizeRoles("bidder"), createCheckoutSession);

module.exports = router;
