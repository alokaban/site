const express = require('express');
const User = require('../models/User');
const axios = require('axios');
const { Router } = express;

const router = Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { username, email, password, referralCode } = req.body;

  // Проверка реферального кода
  const referrer = referralCode ? await User.findOne({ referralCode }) : null;
  if (referralCode && !referrer) {
    return res.status(400).json({ message: 'Invalid referral code' });
  }

  // Генерация нового реферального кода для пользователя
  const newReferralCode = Math.random().toString(36).substring(2, 8);

  const newUser = new User({
    username,
    email,
    password,  // В реальном проекте пароль нужно хэшировать!
    referralCode: newReferralCode,
    referredBy: referrer ? referrer.username : null,
  });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully', referralCode: newReferralCode });
});

// Получение курса биткоина с Binance
router.get('/rates', async (req, res) => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    const bitcoinRate = response.data.price;
    res.json({ bitcoinRate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rates', error });
  }
});

module.exports = router;
