const Acao = require('./classes/Acao');
const axios = require('axios');
const Utils = {
    formataParaReal: (valor) => {
        return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    extrairAcao: (input) => {
        const regex = /^\/(\w+)\s([\d,.]+)\s([\d,.]+)$/;
        const match = input.match(regex);
    
        if (!match) return null; // Retorna null se o formato estiver incorreto
    
        const tipo = match[1];
        let quantidade = parseFloat(match[2].replace(',', '.')); // Quantidade desejada (USDT, BTC, etc.)
        const valorUnitario = parseFloat(match[3].replace(',', '.')); // Preço unitário da moeda em reais
    
        let total = 0;
    
        if (tipo === 'btc' || tipo === 'eth') {
            total = quantidade / valorUnitario; // Fração de BTC ou ETH adquirida
        } else if (tipo === 'usdt') {
            total = quantidade; // Para USDT, o total sempre é igual à quantidade
            quantidade = quantidade * valorUnitario; // Quantidade convertida em reais
        } else {
            return 'Tipo de moeda não reconhecido.';
        }
    
        // Arredonda os valores para até 5 casas decimais
        quantidade = parseFloat(quantidade.toFixed(5));
        total = parseFloat(total.toFixed(5));
    
        return new Acao(tipo, valorUnitario, quantidade, total);
    },
    getSaudacao: (username) => {
        const hour = new Date().getHours();
        let greeting;
    
        if (hour < 6) {
            greeting = '🌃  Boa madrugada, ';
        } else if (hour < 12) {
            greeting = '☀️  Bom dia, ';
        } else if (hour < 18) {
            greeting = '🌇  Boa tarde, ';
        } else {
            greeting = '🌙  Boa noite, ';
        }
        return `/menu\n${greeting}${username}!`;
    },
    getValorAtualMoeda: async (moeda) => {
        switch (moeda) {
            case 'btc':
                return await Utils.getPrecoBitcoin();
            case 'eth':
                return await Utils.getPrecoEthereum();
            case 'usdt':
                return await Utils.getPrecoDolar();
            default:
                return null;
        }
    },
    getPrecoBitcoin: async () => {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
        return response.data.bitcoin.brl;
    },
    getPrecoEthereum: async () => {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=brl');
        return response.data.ethereum.brl;
    },
    getPrecoDolar: async () => {
        const response = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        return response.data.USDBRL.bid;
    },
}

module.exports = Utils;