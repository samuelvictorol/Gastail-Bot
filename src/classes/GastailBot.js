const UsuarioManager = require('../managers/UsuarioManager');
const BotEnum = require("../enums/BotEnum");
const CarteiraEnum = require("../enums/CarteiraEnum");
const dotenv = require('dotenv');
const axios = require('axios');
const Utils = require('../Utils');
const CarteiraManager = require('../managers/CarteiraManager');
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_BACKEND_URL = process.env.BOT_BACKEND_URL;
const BOTCHAT_LINK_TELEGRAM = process.env.BOTCHAT_LINK_TELEGRAM;

class GasTailBot {
    #usuario = null;
    webhook_setup = false;
    BOTCHAT_URL = BOTCHAT_LINK_TELEGRAM;

    constructor() {
        this.WEBHOOK_URL = `${BOT_BACKEND_URL}/${TELEGRAM_BOT_TOKEN}`;
        this.FULL_WEBHOOK_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${this.WEBHOOK_URL}`;
    }

    setWebhookSetup = async (isWorking) => {
        this.webhook_setup = isWorking;
        console.log('🪝 Webhook configurado com sucesso!');
    }

    setUsuarioContext = async (userData) => {
        this.#usuario = await UsuarioManager.criar_usuario(userData)
        .then((usuario) => {
            // console.log('🐦 Usuário:', usuario)
            return usuario;
        })
        .catch((error) => {
            console.error('Erro ao criar usuário:', error);
        });
    }

    sendMessage = async (chatId, text) => {
        try {
            const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: chatId,
                text: text
            });
            if (response.status !== 200) {
                console.error(`Erro ao enviar mensagem: ${response.status} - ${response.data}`);
            } else {
                console.log(`✉️ Mensagem enviada para o chat_id ${chatId}`);
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    }

    getGasTailBotInfo = () => {
        return {
            usuario: this.#usuario,
        };
    }

    exeComando = async (chat, text) => {
        const comando = text.split(" ")[0];
        console.log(chat)
        console.log('Comando:', comando);
        switch (comando) {
            case '/menu':
                await this.sendMessage(chat.id, '/menu' + BotEnum.MENUS + BotEnum.FOOTER_START);
                break;
            case '/start':
                await this.sendMessage(chat.id, Utils.getSaudacao(chat.first_name) + BotEnum.START + BotEnum.MENUS + BotEnum.FOOTER_START + BotEnum.REFERENCIA);
                break;
            case '/usdt':
                const acao = Utils.extrairAcao(text);
                if(!acao) {
                    await this.sendMessage(chat.id, BotEnum.COMANDO_INVALIDO);
                    return
                }

                const carteira = this.#usuario.carteiras.length > 0 ? this.#usuario.carteiras.find(carteira => carteira.tipo === CarteiraEnum.USDT) : null;
                if(!carteira) {
                    const carteiraUsdt = await CarteiraManager.criar_carteira(CarteiraEnum.USDT);
                    await CarteiraManager.empilharAcao(carteiraUsdt._id, acao);
                    this.#usuario.carteiras.push(carteiraUsdt);
                    await this.#usuario.save();
                }
                await this.sendMessage(chat.id, 'Fundos em USDT registrados com sucesso!');
                break;
            default:
                await this.sendMessage(chat.id, 'Comando inválido. Digite /start para começar.');
                break;
        }
    }

    exeOpcaoMenu = async (chat, text) => {
        const opcao = text.split(" ")[0];
        console.log('Opção:', opcao);
        switch (opcao) {
            case '3':
                // registrar compra
                await this.sendMessage(chat.id, BotEnum.MENU3_INSTRUCAO);
                break;
            case '5':
            // mostra a cotação do Bitcoin, Ethereum e Dólar
                try {
                    const btcEthResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=brl');
                    const dolarResponse = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');

                    const bitcoinPrice = btcEthResponse.data.bitcoin.brl;
                    const ethereumPrice = btcEthResponse.data.ethereum.brl;
                    const dolarPrice = dolarResponse.data.USDBRL.bid;

                    const fontes = 'Fontes: CoinGecko e AwesomeAPI';
                    const truncarDuasCasas = (valor) => Math.floor(valor * 100) / 100;

                    const message = `Cotação Atual\n\n`
                        + `🪙 Bitcoin: R$ ${truncarDuasCasas(bitcoinPrice).toFixed(2).replace('.', ',')}\n`
                        + `💎 Ethereum: R$ ${truncarDuasCasas(ethereumPrice).toFixed(2).replace('.', ',')}\n`
                        + `💵 Dólar: R$ ${truncarDuasCasas(parseFloat(dolarPrice) || 0).toFixed(2).replace('.', ',')}\n\n`
                        + `${fontes}`;

                    await this.sendMessage(chat.id, message);
                } catch (error) {
                    console.error('Erro ao buscar cotações:', error);
                    await this.sendMessage(chat.id, "Erro ao buscar cotações. Tente novamente mais tarde.");
                }
                break;
            default:
                await this.sendMessage(chat.id, BotEnum.MENU_INVALIDO);
                break;
        }
    }
}

module.exports = GasTailBot;
