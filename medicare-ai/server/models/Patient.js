const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    bloodType: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Stable', 'Critical', 'Recovering'],
        default: 'Active'
    },
    medicalHistory: [String],
    allergies: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', PatientSchema);
