const mongoose = require("mongoose");
const Auction = require("../models/auctionSchema");

exports.checkAuctionEndTime = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Auction ID" });
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return res.status(404).json({ message: "Auction item not found" });
  }
  const now = new Date();
  if (new Date(auctionItem.starttime) > now) {
    return res.status(400).json({ message: "Auction is not started yet." });
  }
  if (new Date(auctionItem.endtime) < now) {
    // Update auction status to 'Inactive' if it's ended
    if (auctionItem.status !== "Inactive") {
      auctionItem.status = "Inactive";
      await auctionItem.save();
    }
    return res.status(400).json({ message: "Auction has already ended." });
  }

  await auctionItem.save();
  next();
};
