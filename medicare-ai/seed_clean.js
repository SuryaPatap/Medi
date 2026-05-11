const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

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
    }
];

const seedDB = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI.split('@')[1]); // Log host only for safety
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Cleaning existing users...');
        await User.deleteMany({});

        console.log('Inserting demo users...');
        await User.insertMany(seedUsers);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
