// backend/src/scripts/seedDemo.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const connectDB = require('../config/database');

const User = require('../models/User');
const Trade = require('../models/Trade');
const Member = require('../models/Member');
const Procurement = require('../models/Procurement');
const Lot = require('../models/Lot');
const Payout = require('../models/Payout');

async function seed() {
    try {
        console.log('Clearing old demo data for FPO...');
        await User.deleteMany({ source: 'demo' });
        await Member.deleteMany({ source: 'demo' });
        await Procurement.deleteMany({ source: 'demo' });
        await Lot.deleteMany({ source: 'demo' });
        await Trade.deleteMany({ source: 'demo' });
        await Payout.deleteMany({ source: 'demo' });

        // CREATE FPO
        const fpo = await User.findOneAndUpdate(
            { phone: "8178360741" },
            {
                name: "Kendrapara Kisan FPO",
                role: "fpo_manager",
                organizationName: "Kendrapara Kisan FPO",
                district: "Kendrapara",
                state: "Odisha",
                upiId: "kendraparakisan@upi",
                source: "demo"
            },
            { upsert: true, new: true }
        );

        // CREATE TRADER
        await User.findOneAndUpdate(
            { phone: "7251003723" },
            {
                name: "Adani Agri Trader", 
                role: "trader",
                source: "demo"
            },
            { upsert: true, new: true }
        );

        // CREATE MEMBERS
        const memberData = [
            { name: "Ramesh Kumar", phone: "9111111111", village: "Marsaghai", crop: "Paddy", contribution: 500, grade: "A" },
            { name: "Sunita Devi", phone: "9222222222", village: "Pattamundai", crop: "Paddy", contribution: 320, grade: "B" },
            { name: "Arjun Behera", phone: "9333333333", village: "Kendrapara", crop: "Wheat", contribution: 410, grade: "A" },
            { name: "Priya Sahoo", phone: "9444444444", village: "Aul", crop: "Paddy", contribution: 280, grade: "A" },
            { name: "Mohan Das", phone: "9555555555", village: "Rajnagar", crop: "Maize", contribution: 350, grade: "B" },
            { name: "Kavita Nayak", phone: "9666666666", village: "Derabish", crop: "Wheat", contribution: 290, grade: "A" }
        ];

        const members = await Promise.all(memberData.map(m => Member.create({
            fpoId: fpo._id,
            ...m,
            source: "demo"
        })));

        // CREATE PROCUREMENTS
        const procData = [
            // 5 aggregated
            { farmerId: members[0]._id, farmerName: members[0].name, crop: "Paddy", quantity: 500, grade: "A", moisturePercent: 12, pricePerKg: 21, totalAmount: 10500, status: "aggregated" },
            { farmerId: members[1]._id, farmerName: members[1].name, crop: "Paddy", quantity: 320, grade: "B", moisturePercent: 14, pricePerKg: 19, totalAmount: 6080, status: "aggregated" },
            { farmerId: members[2]._id, farmerName: members[2].name, crop: "Wheat", quantity: 410, grade: "A", moisturePercent: 11, pricePerKg: 22, totalAmount: 9020, status: "aggregated" },
            { farmerId: members[3]._id, farmerName: members[3].name, crop: "Paddy", quantity: 280, grade: "A", moisturePercent: 12, pricePerKg: 21, totalAmount: 5880, status: "aggregated" },
            { farmerId: members[5]._id, farmerName: members[5].name, crop: "Wheat", quantity: 290, grade: "A", moisturePercent: 11, pricePerKg: 22, totalAmount: 6380, status: "aggregated" },
            // 3 pending
            { farmerId: members[4]._id, farmerName: members[4].name, crop: "Maize", quantity: 350, grade: "B", moisturePercent: 15, pricePerKg: 18, totalAmount: 6300, status: "pending" },
            { farmerId: members[0]._id, farmerName: members[0].name, crop: "Paddy", quantity: 100, grade: "A", moisturePercent: 12, pricePerKg: 21, totalAmount: 2100, status: "pending" },
            { farmerId: members[1]._id, farmerName: members[1].name, crop: "Paddy", quantity: 50, grade: "B", moisturePercent: 14, pricePerKg: 19, totalAmount: 950, status: "pending" }
        ];

        const procurements = await Promise.all(procData.map(p => Procurement.create({
            fpoId: fpo._id,
            ...p,
            source: "demo"
        })));

        // CREATE LOTS
        const lot1Procs = procurements.filter(p => p.crop === "Paddy" && p.status === "aggregated");
        const lot1 = await Lot.create({
            fpoId: fpo._id,
            lotNumber: "LOT-001",
            crop: "Paddy",
            totalQuantity: 1100,
            gradeAverage: "A",
            reservePricePerKg: 21,
            status: "sold",
            procurementIds: lot1Procs.map(p => p._id),
            source: "demo"
        });

        const lot2Procs = procurements.filter(p => p.crop === "Wheat" && p.status === "aggregated");
        const lot2 = await Lot.create({
            fpoId: fpo._id,
            lotNumber: "LOT-002",
            crop: "Wheat",
            totalQuantity: 700,
            gradeAverage: "A",
            reservePricePerKg: 22,
            status: "published",
            procurementIds: lot2Procs.map(p => p._id),
            source: "demo"
        });

        const lot3Procs = procurements.filter(p => p.crop === "Maize" && p.status === "pending");
        const lot3 = await Lot.create({
            fpoId: fpo._id,
            lotNumber: "LOT-003",
            crop: "Maize",
            totalQuantity: 350,
            gradeAverage: "B",
            reservePricePerKg: 18,
            status: "draft",
            procurementIds: lot3Procs.map(p => p._id),
            source: "demo"
        });

        // CREATE TRADES
        const trade1 = await Trade.create({
            tradeId: 1001,
            lotId: lot1._id,
            buyer: "ITC Agro Ltd",
            amount: 23100,
            status: "COMPLETED",
            txHash: "0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890",
            contractAddress: "0x62101bd18f7466E86D8792b16aEE50ed027fD5D1",
            source: "demo"
        });

        const trade2 = await Trade.create({
            tradeId: 1002,
            lotId: lot2._id,
            buyer: "Adani Agri Fresh",
            amount: 15400,
            status: "AGREED",
            txHash: null,
            source: "demo"
        });

        // CREATE PAYOUTS (Only for TRADE-001)
        const rate = 21;
        const payouts = await Promise.all(members.map((m, idx) => {
            const gross = m.contribution * rate;
            const deductions = gross * 0.05; // 5% fee
            const net = gross - deductions;
            return Payout.create({
                tradeId: trade1._id,
                farmerId: m._id,
                farmerName: m.name,
                contributionKg: m.contribution,
                grade: m.grade,
                ratePerKg: rate,
                grossAmount: gross,
                deductions: deductions,
                netAmount: net,
                utrReference: `UTR9876543210${idx}`,
                status: "paid",
                source: "demo"
            });
        }));

        console.log(`✅ Seeded: 1 FPO, 6 farmers, 8 procurements, 3 lots, 2 trades, 6 payouts`);
    } catch (err) {
        console.error('Seeding FPO failed:', err);
    }
}

module.exports = seed;
