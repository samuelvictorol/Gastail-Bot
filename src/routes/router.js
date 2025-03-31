const express = require('express');
const router = express.Router();
const BotRouter = require('./BotRouter');
const ApiRouter = require('./ApiRouter');

// Declara as rotas do sistema
router.use('/', BotRouter);
router.use('/api', ApiRouter);

module.exports = router;
