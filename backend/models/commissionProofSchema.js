const mongoose = require('mongoose');


const paymentProofSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    proof:{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    uploadedat: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected', 'settled'],
    },
    amount: Number,
    comment: String,
    
});


module.exports = mongoose.model('PaymentProof', paymentProofSchema);