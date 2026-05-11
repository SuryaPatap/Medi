const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Inventory = require('./models/Inventory');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const pCount = await Patient.countDocuments();
        const aCount = await Appointment.countDocuments();
        const iCount = await Inventory.countDocuments();

        console.log(`Patients: ${pCount}`);
        console.log(`Appointments: ${aCount}`);
        console.log(`Inventory: ${iCount}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
