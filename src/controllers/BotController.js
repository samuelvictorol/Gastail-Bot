const axios = require('axios');
const GasTailBot = require('../classes/GastailBot');

const Gastail = new GasTailBot();

const BotController = {
    setWebhook: async () => {
        // Configuração do webhook do Telegram
        try {
            const response = await axios.get(Gastail.FULL_WEBHOOK_URL);
            if (response.status === 200) {
                await Gastail.setWebhookSetup(true);
            } else {
                console.error(`Erro ao configurar o webhook: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao configurar o webhook:', error);
        }
    },
    webhook: async (req, res) => {
        const reqData = req.body;
        // tratamentos para evitar "engasgos" do bot por mensagens editadas ou diferentes de string
        if(!reqData) return res.status(400).json({ error: 'Mensagem não recebida corretamente' });
        if( reqData && reqData.edited_message ) return res.status(200).json({ status: 'ok' });
        else if (reqData && !reqData.message) {
            return res.status(400).json({ error: 'Mensagem não recebida corretamente' });
        }
        // tratamento da mensagem recebida utilizando o objeto Gastail
        try {
            const message = reqData.message
            const chat = message.chat;
            await Gastail.setUsuarioContext(chat);
            if (message.text.startsWith('/')) {
                await Gastail.exeComando(chat, message.text)
            } else await Gastail.exeOpcaoMenu(chat, message.text);
            return res.json({ status: 'ok' });
        } catch (error) {
            console.error('Erro ao processar o webhook:', error);
            return res.status(400).json({ error: 'Erro no processamento do webhook', message: error.message });
        }
    }
}

module.exports = BotController;
