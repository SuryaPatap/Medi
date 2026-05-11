const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server/.env
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
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        for (const userData of seedUsers) {
            await User.findOneAndUpdate(
                { email: userData.email },
                userData,
                { upsert: true, new: true }
            );
            console.log(`User seeded/updated: ${userData.email}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err.message);
        process.exit(1);
    }
};

seedDB();
