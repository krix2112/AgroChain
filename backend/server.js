// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/error');

const app = express();

// Connect to Database
connectDB().then(async () => {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('127.0.0.1')) {
        const seedLib = require('./scripts/demo-seed-lib');
        await seedLib();
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/trade', require('./src/routes/trade'));
app.use('/api/payment', require('./src/routes/payment'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'AgroChain Backend is running' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
