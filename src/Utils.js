const Acao = require('./classes/Acao');

const Utils = {
    formataParaReal: (valor) => {
        return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    extrairAcao: (input) => {
        const regex = /^\/(\w+)\s(\d+)\s([\d,.]+)$/;
        const match = input.match(regex);

        if (!match) return null; // Retorna null se o formato estiver incorreto

        const tipo = match[1];
        const quantidade = parseInt(match[2], 10);
        const valor = parseFloat(match[3].replace(',', '.'));
        const total = quantidade * valor;
        return new Acao(tipo, valor, quantidade, total);
    },
    getSaudacao: (username) => {
        const hour = new Date().getHours();
        let greeting;
    
        if (hour < 6) {
            greeting = '🐦‍🔥🌙  Boa madrugada, ';
        } else if (hour < 12) {
            greeting = '🐦‍🔥☀️  Bom dia, ';
        } else if (hour < 18) {
            greeting = '🐦‍🔥🌇  Boa tarde, ';
        } else {
            greeting = '🐦‍🔥🌃  Boa noite, ';
        }
        return `/menu\n${greeting}${username}!`;
    }
}

module.exports = Utils;