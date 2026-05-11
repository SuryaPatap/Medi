const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', async (req, res) => {
    try {
        const items = await Inventory.find().sort({ name: 1 });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/inventory/:id
// @desc    Get inventory item by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        res.json(item);
    } catch (err) {
        console.error("GET Inventory Error:", err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Item not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/inventory
// @desc    Add new inventory item
// @access  Private
router.post('/', async (req, res) => {
    try {
        // Check if item already exists
        const { name, category } = req.body;
        let item = await Inventory.findOne({ name, category });

        if (item) {
            // If exists, just update quantity? Or return error? 
            // For simple CRUD, let's return error or assume unique names.
            return res.status(400).json({ msg: 'Item already exists' });
        }

        // Determine status based on quantity
        let status = 'In Stock';
        if (req.body.quantity <= 0) status = 'Out of Stock';
        else if (req.body.quantity <= (req.body.lowStockThreshold || 10)) status = 'Low Stock';

        const newItem = new Inventory({ ...req.body, status });
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/inventory/:id
// @desc    Update item (restock or consume)
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { quantity, lowStockThreshold } = req.body;

        // Calculate new status if quantity is changing
        let updateData = { ...req.body, updatedAt: Date.now() };

        if (quantity !== undefined) {
            let status = 'In Stock';
            const threshold = lowStockThreshold || 10; // fetch existing if needed, but for now rely on passed or default
            if (quantity <= 0) status = 'Out of Stock';
            else if (quantity <= threshold) status = 'Low Stock';
            updateData.status = status;
        }

        const item = await Inventory.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
