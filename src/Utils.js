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
        let quantidade = parseFloat(match[2].replace(',', '.')); // Converte a quantidade corretamente
        const valor = parseFloat(match[3].replace(',', '.')).toFixed(6); // Ajuste para 6 casas decimais
    
        // Tratamento específico para cada tipo
        if (tipo === 'btc' || tipo === 'eth') {
            quantidade = quantidade / 100; // Converte para porcentagem
        } else if (tipo === 'usdt') {
            // Verifica se a quantidade de USDT é inteira
            if (!Number.isInteger(quantidade)) {
                return 'Quantidade para USDT deve ser um número inteiro.'
            }
            quantidade = Math.floor(quantidade); // Converte para inteiro, se necessário
        }
    
        const total = (quantidade * parseFloat(valor)).toFixed(6); // Garante que o total também tenha até 6 casas
    
        return new Acao(tipo, parseFloat(valor), quantidade, parseFloat(total));
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