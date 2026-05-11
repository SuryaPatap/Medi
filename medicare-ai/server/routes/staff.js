const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const auth = require('../middleware/auth');

// @route   GET /api/staff
// @desc    Get all staff members
// @access  Private
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.find().sort({ name: 1 });
        res.json(staff);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/staff/:id
// @desc    Get staff member by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ msg: 'Staff member not found' });
        res.json(staff);
    } catch (err) {
        console.error("GET Staff Error:", err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Staff member not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/staff
// @desc    Add new staff member
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { email } = req.body;
        let staff = await Staff.findOne({ email });
        if (staff) {
            return res.status(400).json({ msg: 'Staff member with this email already exists' });
        }

        const newStaff = new Staff(req.body);
        const savedStaff = await newStaff.save();
        res.json(savedStaff);
    } catch (err) {
        console.error("POST Staff Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/staff/:id
// @desc    Update staff member
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!staff) return res.status(404).json({ msg: 'Staff member not found' });
        res.json(staff);
    } catch (err) {
        console.error("PUT Staff Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
