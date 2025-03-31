const { Usuario: UsuarioModel } = require('../models/Usuario');

const ApiManager = {
    login: async (token) => {
        const user = await UsuarioModel.findOne({ token:  token  });
        if (!user) {
            return null;
        }
        return user;
    },
    dashboard: async (token) => {
        const user = await UsuarioModel.findOne({ token:  token  });
        if (!user) {
            return null;
        }
        const carteiras = await user.populate('carteiras');
        let responseObj = {
            btcSaldo: 0,
            btcAcoes: 0,
            ethSaldo: 0,
            ethAcoes: 0,
            usdtSaldo: 0,
            usdtAcoes: 0,
        }
        carteiras.carteiras.forEach(carteira => {
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

}

module.exports = ApiManager;