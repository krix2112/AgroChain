// backend/src/config/database.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        
        // In-memory fallback for seamless local demo experience
        if (!uri || uri.includes('localhost:27017')) {
            console.log('⚠️ Local MongoDB not found. Starting in-memory instance for demo...');
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            // Update env for other scripts if needed
            process.env.MONGODB_URI = uri;
        }

        await mongoose.connect(uri);
        console.log(`✅ MongoDB connected: ${uri.includes('memory') ? 'Demo (In-Memory)' : 'External'}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
