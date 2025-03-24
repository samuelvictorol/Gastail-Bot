const express = require('express');
const router = require('./routes/router');
const cors = require('cors');
const conn = require('./db/conn');
const app = express();
const BotController = require('./controllers/BotController');

BotController.setWebhook();
conn()
app.use(cors());
app.use(express.json());
app.use('/', router);
// Configura o webhook

module.exports = app;   