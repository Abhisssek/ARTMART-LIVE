const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    biddername: { type: String, required: true },
    biddingtime:{
        type: Date,
        default: Date.now
    },
    auctionitem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bid', bidSchema);
