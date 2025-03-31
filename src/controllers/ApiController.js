const ApiManager = require("../managers/ApiManager");


const ApiController = {
    login: async (req, res) => {
        try {
            const { token } = req.body;
            // Aqui você pode adicionar a lógica de autenticação
            if(!token || token.length < 10) {
                return res.status(400).json({ message: 'Token inválido' });
            } else {
                const userLogado = await ApiManager.login(token)
                if (userLogado) {
                    return res.status(200).json({ message: 'Login bem-sucedido', user: userLogado });
                } else {
                    return res.status(401).json({ message: 'Usuário não encontrado' });
                }
            }
        } catch (error) {
            console.error('Error login controller:', error);
            return res.status(500).json({ message: 'Error login controller:' });
        }
    },
    dash: async (req, res) => {
        try {
            const { token } = req.body;
            if(!token || token.length < 10) {
                return res.status(400).json({ message: 'Token inválido' });
            } else {
                const userData = await ApiManager.dashboard(token)
                if (userData) {
                    return res.status(200).json(userData);
                } else {
                    return res.status(401).json({ message: 'Você ainda não possui carteiras ativas para gerar gráficos' });
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            res.status(500).json({ message: error });
        }
    },
    saldo: async (req, res) => {
        try {
            const { token } = req.body;
            if(!token || token.length < 10) {
                return res.status(400).json({ message: 'Token inválido' });
            } else {
                const saldoStr = await ApiManager.saldo(token)
                return res.status(200).json(saldoStr);
            }
        } catch (error) {
            console.error('Error fetching saldo data:', error);
            res.status(500).json({ message: error });
        }
    },
    acoes: async (req, res) => {
        try {
            const { token } = req.body;
            if(!token || token.length < 10) {
                return res.status(400).json({ message: 'Token inválido' });
            } else {
                const acoes = await ApiManager.acoes(token)
                return res.status(200).json(acoes);
            }
        } catch (error) {
            console.error('Error fetching acoes data:', error);
            res.status(500).json({ message: error });
        }
    },
    vender_acao: async (req, res) => {
        try {
            const { token, acao } = req.body;
            if(!token || token.length < 10) {
                return res.status(400).json({ message: 'Token inválido' });
            } else {
                const acaoVender = await ApiManager.vender_acao(token, acao)
                return res.status(200).json(acaoVender);
            }
        } catch (error) {
            console.error('Error fetching acoes data:', error);
            res.status(500).json({ message: error });
        }
    },

}

module.exports = ApiController;