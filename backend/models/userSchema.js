const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    profilename:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['bidder','auctioneer','admin'],
        default:'bidder',
        // required: true
        
    },
    notifications: [{
        message: { type: String },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }]
,      
    isSuspended:{
        type: Boolean,
        default: false
    },
    profileImage: {
        public_id: { type: String, default: "" },
        url: { type: String, default: "" }
    },
    stripeAccountId: { type: String, default: null },
    unpaidCommission:{
        type: Number,
        default:0
    },
    moneySpent:{
        type: Number,
        default:0
    },
    commissionStatus:{
        type: String,
        enum:['pending','approved'],
        
    },
    auctionWon:{
        type: Number,
        default:0
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('User', userSchema);