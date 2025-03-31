const { Usuario: UsuarioModel } = require('../models/Usuario');
const Utils = require('../Utils');
const UsuarioManager = require('./UsuarioManager');
const ApiManager = {
    login: async (token) => {
        const user = await UsuarioModel.findOne({ token:  token  });
        if (!user) {
            return null;
        }
        return user;
    },
    dashboard: async (token) => {
        // retorna um objeto com dados para criação dos graficos no frontend
        const user = await UsuarioModel.findOne({ token:  token  });
        if (!user) {
            return null;
        }
        await user.populate('carteiras');
        let responseObj = {
            btcSaldo: 0,
            btcAcoes: 0,
            ethSaldo: 0,
            ethAcoes: 0,
            usdtSaldo: 0,
            usdtAcoes: 0,
        }
        user.carteiras.forEach(carteira => {
            switch(carteira.moeda) {
                case 'BTC':
                    responseObj.btcSaldo += carteira.saldo;
                    responseObj.btcAcoes += carteira.acoes.length;
                    break;
                case 'ETH':
                    responseObj.ethSaldo += carteira.saldo;
                    responseObj.ethAcoes += carteira.acoes.length;
                    break;
                case 'USDT':
                    responseObj.usdtSaldo += carteira.saldo;
                    responseObj.usdtAcoes += carteira.acoes.length;
                    break;
            }
        });
        return responseObj;
    },
    saldo: async (token) => {
        const user = await UsuarioModel.findOne({ token:  token  });
        if (!user) {
            return null;
        }
        const saldoStr = await UsuarioManager.getSaldoObject(user.chat_id);
        return saldoStr;
    },
    acoes: async (token) => {
        // retorna um objeto com dados das transações nas carteiras do usuário comparando o valor de compra com o atual em tempo real
        const user = await UsuarioModel.findOne({ token: token });
        if (!user) {
            return null;
        }
        let acoes = [
            // {moeda: 'BTC', acoes: [{ total: 0, valorAtual: 0, icon: 'trending_up' }] }, exemplo de estrutura
        ];

        await user.populate('carteiras');

        // for...of para garantir a execução assíncrona correta
        for (let carteira of user.carteiras) {
            for (let acao of carteira.acoes) {
                let moeda = acoes.find(m => m.moeda === acao.tipo);
                if (!moeda) {
                    moeda = { moeda: acao.tipo, acoes: [] };
                    acoes.push(moeda);
                }

                let valorAtualMoeda = await Utils.getValorAtualMoeda(acao.tipo);

                moeda.acoes.push({
                    id: acao.id,
                    status: acao.status,
                    total: acao.total,
                    valorPago: acao.valor,
                    resultado: acao.resultado,
                    valorAtual: valorAtualMoeda,
                    icon: acao.valor > valorAtualMoeda ? 'trending_down' : 'trending_up'
                });
            }
        }
    
        return acoes;
    },
    vender_acao: async (token, acaoObj) => {
        const user = await UsuarioModel.findOne({ token: token });
        if (!user) {
            return null;
        }
    
        await user.populate('carteiras');
        let acao = null;
    
        // Loop pelas carteiras do usuário
        for (let carteira of user.carteiras) {
            // Encontrar a ação no array de ações
            acao = carteira.acoes.find(a => a.id === acaoObj.id);
            if (acao) {
                // Atualiza a ação
                acao.status = 'Venda';
                acao.resultado = acaoObj.valorAtual - acaoObj.valorPago;
    
                // Remove a ação antiga e adiciona a ação atualizada
                carteira.acoes = carteira.acoes.filter(a => a.id !== acaoObj.id);
                carteira.acoes.push(acao);  // Adiciona a ação modificada
    
                // Salva a carteira com a ação atualizada
                await carteira.save();  // Persiste as alterações no banco
                break;
            }
        }
    
        if (!acao) {
            return null;
        }
        return acao;
    }
    
    
}

module.exports = ApiManager;