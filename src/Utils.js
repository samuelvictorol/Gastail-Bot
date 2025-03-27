const Acao = require('./classes/Acao');

const Utils = {
    formataParaReal: (valor) => {
        return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    extrairAcao: (input) => {
        const regex = /^\/(\w+)\s([\d,.]+)\s([\d,.]+)$/;
        const match = input.match(regex);
    
        if (!match) return null; // Retorna null se o formato estiver incorreto
    
        const tipo = match[1];
        let quantidadeEmReais = parseFloat(match[2].replace(',', '.')); // Quantidade em reais que o usuário deseja investir
        const valorDoBtc = parseFloat(match[3].replace(',', '.')); // Preço do BTC em reais
    
        let total = 0;
    
        if (tipo === 'btc' || tipo === 'eth') {
            // Calcula a fração de BTC ou ETH adquirida
            total = quantidadeEmReais / valorDoBtc; // Calcula a quantidade de BTC ou ETH comprada
    
        } else if (tipo === 'usdt') {
            // Para USDT, multiplicamos a quantidade de USDT pelo valor informado
            total = quantidadeEmReais * valorDoBtc; // Agora é multiplicação para USDT
    
        } else {
            return 'Tipo de moeda não reconhecido.';
        }
    
        // Garantindo que o total tenha até 5 casas decimais
        total = parseFloat(total.toFixed(5));
    
        return new Acao(tipo, valorDoBtc, quantidadeEmReais, total); // Retorna o objeto com os dados
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