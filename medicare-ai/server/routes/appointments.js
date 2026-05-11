const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// @route   GET /api/appointments
// @desc    Get all appointments (can filter by date/doctor in future)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', ['name', 'phone']) // Populate patient details
            .sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('patient', ['name', 'phone']);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        console.error("GET Appointment Error:", err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Appointment not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status/details
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/appointments/:id/remind
// @desc    Trigger automated reminder (Mock)
// @access  Private
router.put('/:id/remind', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('patient');
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        // Simulate notification logic
        console.log(`Sending SMS to ${appointment.patient.phone}: "Reminder: Your appointment with ${appointment.doctor} is on ${appointment.date} at ${appointment.time}."`);

        appointment.reminderSent = true;
        appointment.reminderStatus = 'Sent';
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const Patient = require('../models/Patient');
const Invoice = require('../models/Invoice'); // Ensure model exists or create it

// @route   PUT /api/appointments/:id/complete
// @desc    Complete appointment and trigger billing/history updates
// @access  Private
router.put('/:id/complete', auth, async (req, res) => {
    try {
        const { clinicalNotes, codes } = req.body;

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        // 1. Update Appointment Status
        appointment.status = 'Completed';
        appointment.notes = clinicalNotes;
        await appointment.save();

        // 2. Update Patient Medical History
        const patient = await Patient.findById(appointment.patient);
        if (patient) {
            patient.medicalHistory.push(`[${new Date().toLocaleDateString()}] ${clinicalNotes}`);
            await patient.save();
        }

        // 3. Auto-Trigger Billing Draft
        const newInvoice = new Invoice({
            patient: appointment.patient,
            appointment: appointment._id,
            amount: codes && codes.length > 0 ? codes.length * 150 : 200, // Derived logic
            status: 'Pending',
            items: codes ? codes.map(c => ({ description: c.desc, price: 150 })) : [{ description: 'General Consultation', price: 200 }],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });
        await newInvoice.save();

        res.json({ msg: 'Visit completed, records updated, and invoice generated.', appointment, invoice: newInvoice });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
