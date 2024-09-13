const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    trackingId: { type: String},
    createdAt: { type: Date, default: Date.now }
});

// module.exports = mongoose.model('Product', ProductSchema)
module.exports = mongoose.model('OrderHistory', orderHistorySchema);;
