const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referredBy: { type: String },
  balance: { type: Number, default: 0 },
  transactions: [{ type: String }],
});

module.exports = mongoose.model('User', userSchema);
