const express = require('express');
const router = express.Router();
const BotRouter = require('./BotRouter');
// const exampleRouter = require('./exampleRouter');

// Utiliza o roteador de bot
router.use('/', BotRouter);

// router.use('/', exampleRouter);

module.exports = router;
