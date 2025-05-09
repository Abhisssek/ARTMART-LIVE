const mongoose = require('mongoose');


const commissionSchema = new mongoose.Schema({
    amount: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdat: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('Commission', commissionSchema);