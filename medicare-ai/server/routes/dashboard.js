const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const { role, id } = req.user;
        let stats = [];

        if (role === 'admin' || role === 'billing' || role === 'receptionist') {
            // General metrics for Admin, Billing, Reception
            const patientCount = await Patient.countDocuments();
            const revenueResult = await Invoice.aggregate([
                { $match: { status: 'Paid' } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]);
            const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
            const appointmentCount = await Appointment.countDocuments();
            const pendingInvoices = await Invoice.countDocuments({ status: 'Pending' });

            stats = [
                { title: "Total Patients", value: patientCount.toLocaleString(), change: "Hospital wide", color: "text-blue-600" },
                { title: "Revenue", value: `$${revenue.toLocaleString()}`, change: "Total Collection", color: "text-green-600" },
                { title: "Appointments", value: appointmentCount.toString(), change: "Total Scheduled", color: "text-purple-600" },
                { title: "Pending Invoices", value: pendingInvoices.toString(), change: "Unpaid", color: "text-orange-600" },
            ];
        } else if (role === 'doctor') {
            // Doctor-specific metrics
            const patientCount = await Patient.countDocuments({ assignedDoctor: id });
            const appointmentCount = await Appointment.countDocuments({ doctor: id });
            const criticalResults = 3; // Mocked for now

            stats = [
                { title: "My Patients", value: patientCount.toLocaleString(), change: "Assigned to you", color: "text-blue-600" },
                { title: "Appointments", value: appointmentCount.toString(), change: "Your schedule", color: "text-purple-600" },
                { title: "Critical Alerts", value: criticalResults.toString(), change: "Need attention", color: "text-red-600" },
                { title: "Consultations", value: "12", change: "Completed today", color: "text-green-600" },
            ];
        } else {
            // Nurse or fallback
            const patientCount = await Patient.countDocuments();
            stats = [
                { title: "Total Patients", value: patientCount.toLocaleString(), change: "Monitoring", color: "text-blue-600" },
                { title: "Vitals Required", value: "8", change: "Pending updates", color: "text-orange-600" },
                { title: "Medications", value: "15", change: "Due now", color: "text-green-600" },
                { title: "Emergency", value: "0", change: "No alerts", color: "text-red-400" },
            ];
        }

        res.json(stats);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
