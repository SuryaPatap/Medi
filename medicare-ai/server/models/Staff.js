const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Doctor', 'Nurse', 'Receptionist', 'Admin', 'Pharmacist', 'Lab Technician'],
        required: true
    },
    department: {
        type: String,
        default: 'General'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    specialization: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Inactive'],
        default: 'Active'
    },
    availability: [
        {
            day: String,
            startTime: String,
            endTime: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Staff', StaffSchema);
