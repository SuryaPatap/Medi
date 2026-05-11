const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

// @route   GET /api/billing
// @desc    Get all invoices
// @access  Private
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('patient', ['name', 'phone'])
            .sort({ date: -1 });
        res.json(invoices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/billing
// @desc    Create new invoice
// @access  Private
router.post('/', async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        const invoice = await newInvoice.save();
        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/billing/:id/pay
// @desc    Mark invoice as paid
// @access  Private
router.put('/:id/pay', async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: 'Paid',
                    paymentMethod: req.body.paymentMethod || 'Cash'
                }
            },
            { new: true }
        );
        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
