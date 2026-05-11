const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: String, // In future, link to Doctor/User model
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Checkup', 'Follow-up', 'Emergency', 'Routine', 'Consultation'],
        default: 'Checkup'
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show'],
        default: 'Scheduled'
    },
    notes: {
        type: String
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    reminderStatus: {
        type: String,
        enum: ['None', 'Sent', 'Pending', 'Failed'],
        default: 'None'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
