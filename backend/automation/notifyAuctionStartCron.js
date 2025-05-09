const cron = require("node-cron");
const Auction = require("../models/auctionSchema");
const User = require("../models/userSchema");

const notifyAuctionStartCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("🔔 Notify-Auction-Start Cron running...");

    const auctionsToNotify = await Auction.find({
      starttime: { $lte: now },
      notifyusers: { $exists: true, $not: { $size: 0 } },
    });

    for (const auction of auctionsToNotify) {
      const notificationMsg = `🔔 Auction "${auction.title}" has just started!`;

      try {
        // Notify each user
        await User.updateMany(
          { _id: { $in: auction.notifyusers } },
          {
            $push: {
              notifications: {
                message: notificationMsg,
                read: false,
                createdAt: new Date(),
              },
            },
          }
        );

        // Clear the notify list
        auction.notifyusers = [];
        await auction.save();

        console.log(`✅ Users notified for auction "${auction.title}"`);
      } catch (error) {
        console.error(`❌ Error notifying users for auction "${auction.title}":`, error);
      }
    }
  });
};

module.exports = notifyAuctionStartCron;
