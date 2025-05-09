const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingprice: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Renaissance",
      "Romanticism",
      "Impressionism",
      "Surrealism",
      "Abstract",
      "Baroque",
      "Modern",
      "Contemporary",
      "Cubism",
      "Pop Art",
    ],
  },
  condition: {
    type: String,
    enum: ["new", "old"],
    required: true,
  },
  isBlacklisted: { type: Boolean, default: false },
  artcreater: { type: String, required: true },
  artstyle: { type: String, required: true },
  artmadedate: { type: String, required: true },
  currentbid: { type: Number, default: 0 },
  starttime: { type: Date, required: true }, // Changed to Date
  endtime: { type: Date, required: true }, // Changed to Date
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to User
  sellername: { type: String },
  bids: [
    {
      bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Fixed naming
      biddername: { type: String, required: true },
      amount: { type: Number, required: true },
      time: { type: Date, default: Date.now }, // Simplified default
    },
  ],
  highestbidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  commissioncalculated: { type: Boolean, default: false },
  notifyusers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPaymentCompleted: { type: Boolean, default: false },

  createdat: { type: Date, default: Date.now }, // Simplified default
});

// Indexes for faster queries
auctionSchema.index({ starttime: 1 });
auctionSchema.index({ endtime: 1 });
auctionSchema.index({ status: 1, category: 1 }); // Added

module.exports = mongoose.model("Auction", auctionSchema);
