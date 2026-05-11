const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Register Route (For initial setup/dev)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password, role });
        // In production, hash password here! Keeping simple for now as requested "make generic code first"
        // await user.save(); 

        // Storing plain text for now to ensure MVP works immediately without bcrypt errors, 
        // will add hashing in next refinement step.
        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error("Login Error:", err.message); // Modified error message as per instruction
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Simple comparison for MVP
        if (user.password !== currentPassword) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error("Password Update Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password, role: demoRole } = req.body;
        console.log(`Login attempt: email=${email}, role=${demoRole}`);

        let user = null;
        const mongoose = require('mongoose');
        
        // Offline Mode Bypass
        if (mongoose.connection.readyState !== 1) {
            console.log('DB disconnected, using offline bypass for login');
            const offlineUsers = [
                { id: 'offline_1', name: 'Executive User', email: 'executive@mediflow.com', password: 'admin123', role: 'Executive' },
                { id: 'offline_2', name: 'Admin User', email: 'admin@mediflow.com', password: 'admin123', role: 'Admin' },
                { id: 'offline_3', name: 'Doctor User', email: 'doctor@mediflow.com', password: 'admin123', role: 'Doctor' },
                { id: 'offline_4', name: 'Billing User', email: 'billing@mediflow.com', password: 'admin123', role: 'Billing' }
            ];
            user = offlineUsers.find(u => u.email === email);
        } else {
            user = await User.findOne({ email });
        }

        if (!user) {
            console.log(`Login failed: user not found for ${email}`);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Simple comparison for MVP
        if (user.password !== password) {
            console.log(`Login failed: password mismatch for ${email}. Received: "${password}", Expected: "${user.password}"`);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Use demoRole if provided for testing, else use DB role
        const userRole = demoRole || user.role;

        const payload = { user: { id: user.id, role: userRole } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, role: userRole } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
