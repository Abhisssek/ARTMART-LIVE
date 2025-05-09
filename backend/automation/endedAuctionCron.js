const cron = require("node-cron");
const mongoose = require("mongoose");
const Auction = require("../models/auctionSchema");
const Bid = require("../models/bidSchema");
const User = require("../models/userSchema");
const { calculateCommission } = require("../controllers/commissionController");
const { sendEmail } = require("../utils/sendEmail");
const stripe = require("../config/stripe");

const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("🔄 Cron for ended auctions running...");

    const endedAuctions = await Auction.find({
      status: "Active",
      endtime: { $lt: now }, // ✅ Ensure endtime is a Date
    });

    for (const auction of endedAuctions) {
      try {
        console.log(`⏳ Processing auction: ${auction.title}`);

        // ✅ Update auction status & commission
        auction.commissioncalculated = true;
        auction.status = "Inactive";
        await auction.save();

        // ✅ Find highest bidder
        const highestBidder = await Bid.findOne({
          auctionitem: auction._id,
          amount: auction.currentbid,
        });

        console.log("🏆 Highest Bidder:", highestBidder);

        const auctioneer = await User.findById(auction.createdby);
        if (!auctioneer) {
          console.error("❌ Auctioneer not found for auction:", auction.title);
          continue;
        }

        auctioneer.unpaidCommission = await calculateCommission(auction._id);

        if (highestBidder && highestBidder.bidder) {
          // ✅ Convert highestBidder.bidder to ObjectId
          const bidderId = new mongoose.Types.ObjectId(highestBidder.bidder);

          // ✅ Update auction with highest bidder
          auction.highestbidder = bidderId;
          await auction.save();

          console.log("🔍 Fetching bidder details...");
          const bidder = await User.findById(bidderId);
          if (!bidder) {
            console.error("❌ Bidder not found!");
            continue;
          }

          // ✅ Update winner stats
          await User.findByIdAndUpdate(
            bidder._id,
            {
              $inc: {
                moneySpent: highestBidder.amount,
                auctionWon: 1,
              },
            },
            { new: true }
          );

          // ✅ Update auctioneer's unpaid commission
          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidCommission: auctioneer.unpaidCommission,
              },
            },
            { new: true }
          );

          console.log("💳 Generating Stripe payment link...");
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: { name: `Winning Bid for ${auction.title}` },
                  unit_amount: highestBidder.amount * 100, // Convert to cents
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
            payment_intent_data: {
              application_fee_amount: Math.round((highestBidder.amount * 0.05) * 100), // 5% commission
              transfer_data: {
                destination: auctioneer.stripeAccountId,
              },
            },
          });

          const paymentLink = session.url;
          // console.log(session.url);

          // ✅ Send email to highest bidder
          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${bidder.username}, 

Congratulations! You have won the auction for **${auction.title}**. 

To complete your payment securely via Stripe, please use the following link:

➡ **[Click Here to Pay Now ${paymentLink} 

After successful payment, your item will be processed for delivery.

If you have any questions, feel free to contact your auctioneer via email: **${auctioneer.email}**.

Thank you for participating!

Best regards,  
**ARTMART Auction Team**`;

          console.log("📩 Sending email to highest bidder...");
          await sendEmail({ email: bidder.email, subject, message });
          console.log("✅ Email sent successfully!");
        }

        console.log(`✅ Auction "${auction.title}" marked as Inactive.`);
      } catch (error) {
        console.error("❌ Error in ended auction cron:", error);
      }
    }
  });
};

module.exports = endedAuctionCron;
