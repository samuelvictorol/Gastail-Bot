const express = require('express');
const router = express.Router();
const BotRouter = require('./BotRouter');
const ApiRouter = require('./ApiRouter');

// Utiliza o roteador de bot
router.use('/', BotRouter);
router.use('/api', ApiRouter);

module.exports = router;
