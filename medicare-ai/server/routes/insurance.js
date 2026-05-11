const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Schema
const ClaimSchema = new mongoose.Schema({
    patient: { type: String, required: true }, // Ideally a ref, but string for flexibility now
    provider: { type: String, required: true },
    policyNumber: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending', enum: ['Approved', 'Pending', 'Rejected'] },
    date: { type: Date, default: Date.now },
    notes: String
});

const Claim = mongoose.model('Claim', ClaimSchema);

// GET all claims
router.get('/', async (req, res) => {
    try {
        const claims = await Claim.find().sort({ date: -1 });
        res.json(claims);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new claim
router.post('/', async (req, res) => {
    try {
        const newClaim = new Claim(req.body);
        const savedClaim = await newClaim.save();
        res.status(201).json(savedClaim);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
