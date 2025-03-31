const { v4: uuidv4 } = require('uuid');  // Importando a função v4 do pacote uuid

class Acao {
    constructor(tipo, valor, quantidade, total) {
        this.tipo = tipo;
        this.valor = valor;
        this.quantidade = quantidade;
        this.total = total;
        this.timestamps = new Date();
        this.gerarUUID();
        this.status = 'Compra';
    }

    gerarUUID() {
        this.id = uuidv4();
    }
}

module.exports = Acao;
