class Acao {
    constructor(tipo, valor, quantidade) {
        this.tipo = tipo;
        this.valor = valor;
        this.quantidade = quantidade;
        this.timestamps = new Date();
    }
}