const { default: axios } = require("axios");
const { Usuario: UsuarioModel } = require("../models/Usuario");
const CarteiraEnum = require("../enums/CarteiraEnum");
const Utils = require("../Utils");

const UsuarioManager = {
    criar_usuario: async (userData) => {
        // objeto 'chat' do hook do Telegram
        let usuarioExistente = await UsuarioModel.findOne({ username: userData.username });
        if(!usuarioExistente) {
            usuarioExistente = await UsuarioModel.findOne({ chat_id: userData.id });
        }
        if (usuarioExistente) {
            return usuarioExistente;
        }
        // se não tiver usuário com esse username, cria um novo
        const novoUsuario = new UsuarioModel({
            nome: userData.first_name,
            username: userData.username,
            saldo: 0,
            chat_id: userData.id,
            token: ('GasToken:' +  userData.id + userData.username).toLocaleLowerCase(),
            carteiras: [],
        })
        await novoUsuario.save()
        .then(() => {
            console.log('🐦 Novo usuário cadastrado: ', novoUsuario);
        })
        return novoUsuario;
    },
    get_saldo: async (chat_id) => {
        const usuario = await UsuarioModel.findOne({ chat_id: chat_id });
        if(usuario.carteiras.length === 0) {
            return 'Você ainda não possui carteiras ativas.'
        }
        const btcEthResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=brl');
        const dolarResponse = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');

        const bitcoinPrice = btcEthResponse.data.bitcoin.brl;
        const ethereumPrice = btcEthResponse.data.ethereum.brl;
        const dolarPrice = dolarResponse.data.USDBRL.bid;
        console.log('🐦 Preço do Bitcoin: ', bitcoinPrice);
        await usuario.populate('carteiras')
        let carteiras = {
            saldo: 0,
            btc: 0,
            btcBrl: 0,
            eth: 0,
            ethBrl: 0,
            usdt: 0,
            usdtBrl: 0,
        }
        console.log('Bitcoin: '+ typeof bitcoinPrice, bitcoinPrice);
        usuario.carteiras.forEach(carteira => {
            switch(carteira.moeda) {
                case CarteiraEnum.BTC:
                    carteiras.btc += carteira.saldo;
                    carteiras.btcBrl += carteira.saldo * bitcoinPrice;
                    break;
                case CarteiraEnum.ETH:
                    carteiras.eth += carteira.saldo;
                    carteiras.ethBrl += carteira.saldo * ethereumPrice;
                    break;
                case CarteiraEnum.USDT:
                    carteiras.usdt += carteira.saldo;
                    carteiras.usdtBrl += carteira.saldo * dolarPrice;
                    break;
            }
        });
        carteiras.saldo = carteiras.btcBrl + carteiras.ethBrl + carteiras.usdtBrl;
        usuario.saldo = carteiras.saldo;
        await usuario.save();
        return `/saldo\n💰 Saldo Atual\n${Utils.formataParaReal(carteiras.saldo)}\n\n🪙 USDT\n$ ${carteiras.usdt}\n💵 ${Utils.formataParaReal(carteiras.usdtBrl)}\n\n🪙 BTC\n ${carteiras.btc}btc\n💵 ${Utils.formataParaReal(carteiras.btcBrl)}\n\n🪙 Ethereum\n${carteiras.eth}eth\n💵 ${Utils.formataParaReal(carteiras.ethBrl)}`;
    },
    getSaldoObject: async (chat_id) => {
        const usuario = await UsuarioModel.findOne({ chat_id: chat_id });
        if (usuario.carteiras.length === 0) {
            return { mensagem: 'Você ainda não possui carteiras ativas.' };
        }
        
        const btcEthResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=brl');
        const dolarResponse = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    
        const bitcoinPrice = btcEthResponse.data.bitcoin.brl;
        const ethereumPrice = btcEthResponse.data.ethereum.brl;
        const dolarPrice = dolarResponse.data.USDBRL.bid;
    
        await usuario.populate('carteiras');
        
        let carteiras = {
            saldo: 0,
            btc: 0,
            btcBrl: 0,
            eth: 0,
            ethBrl: 0,
            usdt: 0,
            usdtBrl: 0,
        };
        
        usuario.carteiras.forEach(carteira => {
            switch (carteira.moeda) {
                case CarteiraEnum.BTC:
                    carteiras.btc += carteira.saldo;
                    carteiras.btcBrl += carteira.saldo * bitcoinPrice;
                    break;
                case CarteiraEnum.ETH:
                    carteiras.eth += carteira.saldo;
                    carteiras.ethBrl += carteira.saldo * ethereumPrice;
                    break;
                case CarteiraEnum.USDT:
                    carteiras.usdt += carteira.saldo;
                    carteiras.usdtBrl += carteira.saldo * dolarPrice;
                    break;
            }
        });
        
        carteiras.saldo = carteiras.btcBrl + carteiras.ethBrl + carteiras.usdtBrl;
        usuario.saldo = carteiras.saldo;
        await usuario.save();
        
        return {
            saldo: Utils.formataParaReal(carteiras.saldo),
            usdt: carteiras.usdt,
            usdtBrl: Utils.formataParaReal(carteiras.usdtBrl),
            btc: carteiras.btc,
            btcBrl: Utils.formataParaReal(carteiras.btcBrl),
            eth: carteiras.eth,
            ethBrl: Utils.formataParaReal(carteiras.ethBrl),
        };
    }
}

module.exports = UsuarioManager;