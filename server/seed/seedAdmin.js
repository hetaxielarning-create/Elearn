// Run once with: node seed/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const RecommendationRule = require('../models/RecommendationRule');
const { DEFAULT_RULES } = require('../utils/recommendationEngine');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // FIXED: now actually reads from .env instead of using hardcoded values.
  // Also re-syncs the admin's email/password to match .env on every run,
  // so if you change .env later you just re-run this script and it updates.
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@elearning.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    admin = new User({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    await admin.save();
    console.log('Admin account created:', adminEmail, '/', adminPassword);
  } else {
    admin.email = adminEmail;
    admin.password = adminPassword; // pre('save') hook re-hashes it
    await admin.save();
    console.log('Admin account synced with .env credentials:', adminEmail, '/', adminPassword);
  }

  const existingRules = await RecommendationRule.countDocuments();
  if (existingRules === 0) {
    await RecommendationRule.insertMany(DEFAULT_RULES);
    console.log('Default recommendation rules seeded');
  } else {
    console.log('Recommendation rules already exist, skipping seed');
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
