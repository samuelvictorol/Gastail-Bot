const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/ApiController');

// Definir as rotas da api
router.post(`/login`, (req, res) => ApiController.login(req, res));
router.post(`/saldo`, (req, res) => ApiController.saldo(req, res));
router.post(`/dash`, (req, res) => ApiController.dash(req, res));
router.post(`/acoes`, (req, res) => ApiController.acoes(req, res));
router.post(`/vender-acao`, (req, res) => ApiController.vender_acao(req, res));

module.exports = router;
