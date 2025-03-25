class Acao {
    constructor(tipo, valor, quantidade, total) {
        this.tipo = tipo;
        this.valor = valor;
        this.quantidade = quantidade;
        this.total = total;
        this.timestamps = new Date();
    }
}

module.exports = Acao;