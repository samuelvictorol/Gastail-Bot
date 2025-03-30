const { Usuario: UsuarioModel } = require('../models/Usuario');

const ApiManager = {
    login: async (token) => {
        const user = await UsuarioModel.findOne({ token:  token  });
        if (!user) {
            return null;
        }
        return user;
    }

}

module.exports = ApiManager;