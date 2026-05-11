const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = [
    {
        name: 'System Executive',
        email: 'executive@mediflow.com',
        password: 'admin123',
        role: 'executive'
    },
    {
        name: 'Admin User',
        email: 'admin@mediflow.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'Doctor User',
        email: 'doctor@mediflow.com',
        password: 'admin123',
        role: 'doctor'
    },
    {
        name: 'Billing User',
        email: 'billing@mediflow.com',
        password: 'admin123',
        role: 'billing'
    },
    {
        name: 'Nurse User',
        email: 'nurse@mediflow.com',
        password: 'admin123',
        role: 'nurse'
    },
    {
        name: 'Lab User',
        email: 'lab@mediflow.com',
        password: 'admin123',
        role: 'executive' // Using executive role for lab access as per App.jsx routes or I can assign nurse
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing users to avoid conflicts and ensure clean state
        await User.deleteMany({});
        console.log('Cleared existing users.');

        for (const userData of seedUsers) {
            await User.create(userData);
            console.log(`User seeded: ${userData.email}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
