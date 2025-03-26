const { Carteira: CarteiraModel } = require("../models/Carteira");

const CarteiraManager = {
    criar_carteira: async (moeda) => {
        try {
            const carteira = await CarteiraModel.create({ moeda, saldo: 0, acoes: [] });
            return carteira;
        } catch (error) {
            console.error('Erro ao criar carteira:', error);
            throw error;
        }
    },
    empilharAcao: async (carteiraId, acao) => {
        try {
            const carteira = await CarteiraModel.findById(carteiraId);
            carteira.saldo += acao.total;
            carteira.acoes.push(acao);
            await carteira.save();
        } catch (error) {
            console.error('Erro ao empilhar ação:', error);
            throw error;
        }
    }
}

module.exports = CarteiraManager;