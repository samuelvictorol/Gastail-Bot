const express = require('express');
const router = express.Router();
const BotController = require('../controllers/BotController');

// Definir a rota para o webhook do Telegram
router.post(`/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => BotController.webhook(req, res));

module.exports = router;
