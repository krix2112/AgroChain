require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AgroChain Backend is running' });
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
