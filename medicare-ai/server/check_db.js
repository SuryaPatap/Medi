const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function check() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");

        const User = require('./models/User');
        const admin = await User.findOne({ email: 'admin@mediflow.com' });
        if (admin) {
            console.log("✅ Admin User found in DB.");
        } else {
            console.log("❌ Admin User NOT found in DB. Did you seed?");
        }

    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
    } finally {
        process.exit();
    }
}

check();
