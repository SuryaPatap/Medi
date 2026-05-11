const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Security & Optimization Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for easier local development
}));
app.use(compression());
app.use(express.json({ limit: '10mb' })); // Increased limit for clinical data

// Rate Limiting (Relaxed for Dev)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // High limit for local testing
    message: 'Too many requests'
});
if (process.env.NODE_ENV === 'production') {
    app.use('/api/', limiter);
}

// CORS Configuration - Permissive for Dev
app.use(cors({
    origin: true, // Reflect request origin
    credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/insurance', require('./routes/insurance'));

app.get('/', (req, res) => {
    res.send('MediFlow AI API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connection Established');
        console.log('--- API Server Ready on http://127.0.0.1:' + PORT + ' ---');
    })
    .catch(err => {
        console.error('❌ MongoDB Connection ERROR:', err.message);
        console.log('--- Server running in OFFLINE mode (Simulated Data only) ---');
    });

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
