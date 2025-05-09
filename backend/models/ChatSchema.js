// models/chatModel.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assuming your user model is named 'User'
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['admin', 'bidder', 'auctioneer'],
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverRole: {
      type: String,
      enum: ['admin', 'bidder', 'auctioneer'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
