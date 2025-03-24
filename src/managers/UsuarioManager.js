const { Usuario: UsuarioModel } = require("../models/Usuario");

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
            token: 'GasToken:' +  userData.id + userData.username,
            acoes: [],
        })
        await novoUsuario.save()
        .then(() => {
            console.log('🐦 Novo usuário cadastrado: ', novoUsuario);
        })
        return novoUsuario;
    },
}

module.exports = UsuarioManager;