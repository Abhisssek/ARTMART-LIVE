const Auction = require("../models/auctionSchema");  // Import Auction model
const User = require("../models/userSchema");        // Import User model
const stripe = require("../config/stripe");          // Import Stripe

exports.createCheckoutSession = async (req, res) => {
  try {
    const { auctionId, bidAmount } = req.body;

    // Validate input
    if (!auctionId || !bidAmount) {
      return res.status(400).json({ message: "Auction ID and bid amount are required" });
    }

    // Find the auction
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Ensure auction is not active (payment only after auction ends)
    if (auction.status === "Active") {
      return res.status(400).json({ message: "Auction is still active, you can't make payment" });
    }

    // Get the current highest bid and highest bidder
    const currentHighestBid = auction.currentbid;
    const highestBidder = typeof auction.highestbidder === "object"
      ? auction.highestbidder._id
      : auction.highestbidder;

    // Check if user making payment is the highest bidder
    if (req.user.id !== highestBidder.toString()) {
      return res.status(403).json({ message: "Only the highest bidder can make the payment" });
    }

    // Ensure bidAmount matches current highest bid (type-safe comparison)
    if (Number(bidAmount) !== Number(currentHighestBid)) {
      return res.status(400).json({ message: "Bid amount must match the highest bid" });
    }

    // Find the auctioneer (the user who created the auction)
    const auctioneerId = typeof auction.createdby === "object"
      ? auction.createdby._id
      : auction.createdby;
    const auctioneer = await User.findById(auctioneerId);

    if (!auctioneer || !auctioneer.stripeAccountId) {
      return res.status(400).json({ message: "Auctioneer is not set up for payments" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Auction Bid Payment",
              description: auction.title,
            },
            unit_amount: Number(bidAmount) * 100, // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/payment-success",  // Redirect after payment
      cancel_url: "http://localhost:5173/payment-failed",
      payment_intent_data: {
        application_fee_amount: Math.floor(bidAmount * 0.05 * 100), // Admin 5% commission (floor to integer cents)
        transfer_data: {
          destination: auctioneer.stripeAccountId,
        },
      },
    });

    auction.isPaymentCompleted = true;
    await auction.save();  // Save the updated auction


    res.json({ success: true, url: session.url });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};
