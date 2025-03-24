const { Usuario: UsuarioModel } = require("../models/Usuario");
const { Acao: AcaoModel } = require("../models/Acao");

const AcaoManager = {
    criar_acao_entrada: async (username, commandObj) => {
        let usuario = await UsuarioModel.findOne({ username: username })
        if(!usuario) {
            usuario = await UsuarioModel.findOne({ chat_id: username });
            return null;
        }
        const acao = new AcaoModel({
            tipo: '🟢 Crédito',
            titulo: commandObj.titulo,
            valor: commandObj.valor,
            descricao: '',
        });
        await acao.save();
        usuario.saldo = commandObj.tipo.includes('cred') ? usuario.saldo + commandObj.valor : usuario.saldo - commandObj.valor;
        usuario.acoes.push(acao._id);
        await usuario.save();
        return usuario.saldo;
    },
    criar_acao_gasto: async (username, commandObj) => {
        let usuario = await UsuarioModel.findOne({ username: username })
        if(!usuario) {
            usuario = await UsuarioModel.findOne({ chat_id: username });
            return null;
        }
        const acao = new AcaoModel({
            tipo: '🔴 Débito',
            titulo: commandObj.titulo,
            valor: commandObj.valor,
            descricao: '',
        });
        await acao.save();
        usuario.saldo = commandObj.tipo.includes('cred') ? usuario.saldo + commandObj.valor : usuario.saldo - commandObj.valor;
        usuario.acoes.push(acao._id);
        await usuario.save();
        return usuario.saldo;
    },
}

module.exports = AcaoManager;