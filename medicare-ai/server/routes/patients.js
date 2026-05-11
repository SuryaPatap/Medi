const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json(patients);
    } catch (err) {
        console.error("GET Patients Error:", err.message);
        res.status(500).json({ error: 'Server Error', message: err.message });
    }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        console.error("GET Patient Error:", err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Patient not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/patients
// @desc    Add new patient
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        console.log("POST /api/patients Body:", req.body);
        const newPatient = new Patient(req.body);
        const patient = await newPatient.save();
        res.json(patient);
    } catch (err) {
        console.error("POST Patient Error:", err.message);
        res.status(400).json({ error: 'Validation Error', message: err.message });
    }
});

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        console.error("PUT Patient Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
