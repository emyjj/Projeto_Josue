const usuarioService = require('../services/usuarioService');

const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obterTodosUsuarios();
        res.status(200).json({data: usuarios});
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao buscar usuários' });
    }
};

module.exports = {
    buscarUsuarios,
};