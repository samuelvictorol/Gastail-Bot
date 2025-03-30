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
    // dash: async (req, res) => {
    //     try {
    //         // Aqui você pode adicionar a lógica para retornar os dados do dashboard
    //         res.status(200).json({ message: 'Dashboard data' });
    //     } catch (error) {
    //         console.error('Error fetching dashboard data:', error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // },
    // acoes: async (req, res) => {
    //     try {
    //         // Aqui você pode adicionar a lógica para retornar as ações
    //         res.status(200).json({ message: 'Ações data' });
    //     } catch (error) {
    //         console.error('Error fetching acoes data:', error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // },
    // vender_acao: async (req, res) => {
    //     try {
    //         // Aqui você pode adicionar a lógica para vender ações
    //         res.status(200).json({ message: 'Ação vendida com sucesso' });
    //     } catch (error) {
    //         console.error('Error selling action:', error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // },
    // saldo: async (req, res) => {
    //     try {
    //         // Aqui você pode adicionar a lógica para retornar o saldo
    //         res.status(200).json({ message: 'Saldo data' });
    //     } catch (error) {
    //         console.error('Error fetching saldo data:', error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // }
}

module.exports = ApiController;