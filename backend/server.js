// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/error');

const app = express();

// Connect to Database
connectDB().then(async () => {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('127.0.0.1')) {
        const seedLib = require('./scripts/demo-seed-lib');
        await seedLib();
        const seedFpo = require('./src/scripts/seedDemo');
        await seedFpo();
    }
});

// Global Strict CORS for Vercel
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Explicitly allow the Vercel domain or local development
    if (origin && (origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Fallback for safety, but reflecting origin is usually best
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/trade', require('./src/routes/trade'));
app.use('/api/payment', require('./src/routes/payment'));
app.use('/api/listing', require('./src/routes/listing'));
app.use('/api/request', require('./src/routes/cropRequest'));
app.use('/api/bundle', require('./src/routes/bundle'));
app.use('/api/fpo', require('./src/routes/fpo'));
app.use('/api/mandi-intelligence', require('./src/routes/mandiIntelligence'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
