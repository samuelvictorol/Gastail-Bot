

const UsuarioManager = require('../managers/UsuarioManager');
const BotEnum = require("../enums/BotEnum");
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
    BTC_ETH_URL_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=brl';
    DOLAR_URL_API = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';

    constructor() {
        this.WEBHOOK_URL = `${BOT_BACKEND_URL}/${TELEGRAM_BOT_TOKEN}`;
        this.FULL_WEBHOOK_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${this.WEBHOOK_URL}`;
    }

    setWebhookSetup = async (isWorking) => {
        this.webhook_setup = isWorking;
        console.log('🪝 Webhook configurado com sucesso!');
    }

    setUsuario = (usuario) => {
        this.#usuario = usuario;
        console.log('🐦 Usuário:', usuario);
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

    exeComando = async (chat, text) => {
        const comando = text.split(" ")[0];
        console.log(chat);
        console.log('Comando:', comando);
    
        switch (comando) {
            case '/menu':
                await this.sendMessage(chat.id, '/menu' + BotEnum.MENUS + BotEnum.FOOTER_START);
                break;
            case '/start':
                await this.sendMessage(chat.id, BotEnum.REFERENCIA);
                await this.sendMessage(chat.id, Utils.getSaudacao(chat.first_name) + BotEnum.START + BotEnum.MENUS + BotEnum.FOOTER_START );
                break;
            case '/token':
                await this.exeOpcaoMenu(chat, '2');
                break;
            case '/recentes':
                await this.exeOpcaoMenu(chat, '4');
                break;
            case '/saldo':
                const saldoString = await UsuarioManager.get_saldo(chat.id);
                await this.sendMessage(chat.id, saldoString);
                break;
            case '/usdt':
            case '/btc':
            case '/eth':
                await this.registrarFundos(chat, text, comando.substring(1).toUpperCase());
                break;
            default:
                await this.sendMessage(chat.id, 'Comando inválido. Digite /start para começar.');
                break;
        }
    };

    registrarFundos = async (chat, text, tipoCarteira) => {
        const acao = Utils.extrairAcao(text);
        console.log('Ação:', acao);
        if (!acao) {
            await this.sendMessage(chat.id, BotEnum.COMANDO_INVALIDO);
            return;
        } else if(typeof acao === 'string') {
            await this.sendMessage(chat.id, acao);
            return;
        }
        let carteira = null
        if(this.#usuario.carteiras.length > 0) {
            await this.#usuario.populate('carteiras');
            carteira = this.#usuario.carteiras.find(carteira => carteira.moeda === tipoCarteira);
            if(!carteira) {
                carteira = await CarteiraManager.criar_carteira(tipoCarteira);
                this.#usuario.carteiras.push(carteira._id);
                await this.#usuario.save();
            }   
            await CarteiraManager.empilharAcao(carteira._id, acao);
        } else {
            carteira = await CarteiraManager.criar_carteira(tipoCarteira);
            this.#usuario.carteiras.push(carteira._id);
            await CarteiraManager.empilharAcao(carteira._id, acao);
            await this.#usuario.save();
        }
        await this.sendMessage(chat.id, `Fundos em ${tipoCarteira} registrados com sucesso!`);
    };
    

    exeOpcaoMenu = async (chat, text) => {
        const opcao = text.split(" ")[0];
        console.log('Opção:', opcao);
        switch (opcao) {
            case '1':
                // visualizar saldo
                const saldoString = await UsuarioManager.get_saldo(chat.id);
                await this.sendMessage(chat.id, saldoString);
                break;
            case '2':
                // buscar token para acesso do perfil web
                await this.sendMessage(chat.id, '/token\nSeu token para acesso do perfil web:\n\n' + this.#usuario.token);
                await this.sendMessage(chat.id, '🌍 Acesse em:\n' + process.env.FRONTEND_URL);
                break;
            case '3':
                // registrar compra
                await this.sendMessage(chat.id, BotEnum.MENU3_INSTRUCAO);
                break;
            case '4':
                // recuperar as últimas 5 ações do usuário
                const get_acoes_recentes = await CarteiraManager.get_acoes_recentes(this.#usuario.carteiras);
                let message = '/recentes\n🗒️ Ações Recentes\n\n';
                get_acoes_recentes.forEach(carteira => {
                    message += `💸 ${carteira.moeda}\n`;
                    carteira.acoes.forEach(acao => {
                        message += `Compra de ${acao.total} ${carteira.moeda} por ${Utils.formataParaReal(acao.valor)}\n`
                    });
                    message += '\n';
                });
                await this.sendMessage(chat.id, message);
                break;
            case '5':
                // mostra a cotação do Bitcoin, Ethereum e Dólar
                try {
                    const btcEthResponse = await axios.get(this.BTC_ETH_URL_API);
                    const dolarResponse = await axios.get(this.DOLAR_URL_API);
                    const bitcoinPrice = btcEthResponse.data.bitcoin.brl;
                    const ethereumPrice = btcEthResponse.data.ethereum.brl;
                    const dolarPrice = dolarResponse.data.USDBRL.bid;

                    // const fontes = 'Fontes: CoinGecko e AwesomeAPI';
                    const truncarDuasCasas = (valor) => Math.floor(valor * 100) / 100;

                    const message = `Cotação Atual\n\n`
                        + `🪙 Bitcoin: R$ ${truncarDuasCasas(bitcoinPrice).toFixed(2).replace('.', ',')}\n`
                        + `💎 Ethereum: R$ ${truncarDuasCasas(ethereumPrice).toFixed(2).replace('.', ',')}\n`
                        + `💵 Dólar: R$ ${truncarDuasCasas(parseFloat(dolarPrice) || 0).toFixed(2).replace('.', ',')}\n\n`
                        // + `${fontes}`;

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
