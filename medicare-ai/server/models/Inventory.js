const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Medicine', 'Equipment', 'Consumables', 'Surgical', 'Other'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    unit: {
        type: String, // e.g., 'tablets', 'bottles', 'boxes', 'pieces'
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    supplier: {
        type: String
    },
    expiryDate: {
        type: Date
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'],
        default: 'In Stock'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inventory', InventorySchema);
