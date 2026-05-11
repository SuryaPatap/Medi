const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: String, // Optional: link to doctor who performed service
    },
    items: [
        {
            description: { type: String, required: true },
            cost: { type: Number, required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Cancelled', 'Overdue'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Insurance', 'Online', 'None'],
        default: 'None'
    },
    date: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
