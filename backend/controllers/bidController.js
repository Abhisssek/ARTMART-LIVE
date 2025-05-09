const Auction = require("../models/auctionSchema");
const Bid = require("../models/bidSchema");
const User = require("../models/userSchema");



exports.placeBid = async (req, res) => {
  try {
    const { id } = req.params; // Auction ID
    // console.log("🔵 Auction ID:", id);

    const auctionItem = await Auction.findById(id);
    if (!auctionItem) {
      // console.log("🔴 Auction not found!");
      return res.status(404).json({ message: "Auction item not found" });
    }
    // console.log("🟢 Auction found:", auctionItem._id);


    // const allBids = await Bid.find({ auctionitem: auctionItem._id });
    // console.log("🟡 All bids for auction:", allBids);
    const auctionBid = await Bid.find({ auctionitem: auctionItem._id }).sort({ amount: -1 });
    console.log("🟡 Total Bids fetched:", auctionBid.length); // This should return 33 if all bids are fetched
    
    const { amount } = req.body;
    if (!amount) {
      // console.log("🔴 Amount is missing!");
      return res.status(400).json({ message: "Amount is required" });
    }

    if (amount <= auctionItem.currentbid) {
      // console.log("🔴 Bid amount too low:", amount);
      return res
        .status(400)
        .json({ message: "Bid amount should be greater than current bid" });
    }

    if (amount <= auctionItem.startingprice) {
      // console.log("🔴 Bid below starting price:", amount);
      return res
        .status(400)
        .json({ message: "Bid amount should be greater than starting price" });
    }

    if (auctionItem.highestbidder?.toString() === req.user._id.toString()) {
      // console.log("🔴 Same bidder is trying again:", req.user._id);
      return res
        .status(400)
        .json({ message: "You can't bid again until another user bids" });
    }

    // console.log("🟢 Passed all bid validation checks.");

    // Fetch user profile
    const user = await User.findById(req.user._id).select("profilename isSuspended");
    // console.log("🟢 Fetched user:", user);

    //is user suspended
    try {
      if (user.isSuspended) {
        // console.log("🔴 User is suspended:", user.isSuspended);
        return res.status(403).json({
          message: "You are suspended from bidding.",
        });
      }
      
    } catch (error) {
      console.log("🔴 Error checking user suspension:", error);
      
    }


 
    const profilename = user?.profilename?.toString() || "Unknown Bidder";
    // console.log("🟢 Final biddername:", profilename);

    // Check if user already placed a bid
    const bidData = {
      amount,
      bidder: req.user._id,
      biddername: profilename,
      auctionitem: auctionItem._id,
    };
    
    await Bid.create(bidData); // Always create a new document

    // find all auction bids for this auction item
  
    // Ensure `bids` array exists
    if (!Array.isArray(auctionItem.bids)) {
      // console.log("🔴 Bids array is missing, initializing...");
      auctionItem.bids = [];
    }

    // console.log("🟡 Before pushing bid, bids length:", auctionItem.bids.length);

    try {
      auctionItem.bids.push({
        bidder: req.user._id,
        biddername: profilename,
        amount,
        biddingtime: new Date(), // match the field used in the Bid schema
      });
      // nsole.log("🟢 Bid pushed to auctionItem.bids.");
    } catch (pushError) {
      console.error("❌ Error pushing bid:", pushError);
    }

    try {
      await auctionItem.save();
      // console.log("🟢 Auction updated successfully.");
    } catch (saveError) {
      console.error("❌ Error saving auction:", saveError);
    }

    auctionItem.currentbid = amount;
    auctionItem.highestbidder = req.user._id;
    await auctionItem.save();

    const auctionBids = await Bid.find({ auctionitem: auctionItem._id })
      .sort({ amount: -1 })
      .populate("bidder", "name email")
      .select("amount biddername time");
      

    // console.log("🟢 Auc
    // tion bids fetched.");

   

    // log("🟡 Auction bids:", auctionBids);
    // console.log("🟡 Auction bids:", auctionBids);

    const io = req.app.get("socketio"); // ✅ Get the socket instance

    

    io.to(auctionItem._id.toString()).emit("updateBid", {  // ✅ Emit to the auction room only
      auctionId: auctionItem._id,
      currentbid: auctionItem.currentbid,
      highestbidder: auctionItem.highestbidder,
      auctionBids,
      time: new Date(),
    });
    
    console.log("🟢 Bid event emitted for auction:", auctionItem._id);
    

    // console.log("🟢 Bid event emitted.");

    return res.status(201).json({
      success: true,
      message: "Bid placed successfully.",
      currentbid: auctionItem.currentbid,
      highestbidder: auctionItem.highestbidder,
      auctionBids,
      // createdAt: new Date(),
    });
  } catch (error) {
    console.error("❌ Error placing bid:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBidOfAuction = async (req, res) => {
  try {
    const { id } = req.params; // Auction ID
    const auctionItem = await Auction.findById(id);

    if (!auctionItem) {
      return res.status(404).json({ message: "Auction item not found" });
    }

    const auctionBids = await Bid.find({ auctionitem: auctionItem._id })
      .sort({ amount: -1 })
      .populate("bidder", "name email");

    res.status(200).json({
      success: true,
      message: "Bids fetched successfully.",
      auctionBids,
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.myPlacedBids = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the request

    // Fetch bids placed by the user
    const bids = await Bid.find({ bidder: userId })
      // Sort by creation date, most recent first

    if (!bids || bids.length === 0) {
      return res.status(404).json({ message: "No bids found for this user" });
    }

    res.status(200).json({
      success: true,
      message: "Bids fetched successfully.",
      bids,
    });
  } catch (error) {
    console.error("Error fetching user's bids:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



exports.myBidAuctions = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the request

    // Fetch auctions where the user placed bids in that auction
    const auctions = await Auction.find({ bids: { $elemMatch: { bidder: userId } } })
      .populate("bids.bidder", "name email") // Populate bidder details
      .sort({ endtime: -1 }); // Sort by auction end time, most recent first


    if (!auctions || auctions.length === 0) {
      return res.status(404).json({ message: "No auctions found for this user" });
    }

    res.status(200).json({
      success: true,
      message: "User's auction bids fetched successfully.",
      auctions,
    });
    
  } catch (error) {
    console.error("Error fetching user's auction bids:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}