// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/error');

const app = express();

app.get('/version', (req, res) => {
    res.json({ version: 'v1.0.4', timestamp: new Date().toISOString() });
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://agro-chain-web.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight for ALL routes explicitly
app.options('*', cors());

connectDB().then(async () => {
    if (process.env.MONGODB_URI) {
        console.log('Production DB detected, running startup seeding...');
        const seedFpo = require('./src/scripts/seedDemo');
        try {
            await seedFpo();
            console.log('Startup seeding completed successfully');
        } catch (err) {
            console.error('Startup seeding failed:', err.message);
        }
    }
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
