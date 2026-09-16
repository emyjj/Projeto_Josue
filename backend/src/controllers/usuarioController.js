const usuarioService = require('../services/usuarioService');
const bcrypt = require('bcrypt');

const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obterTodosUsuarios();
        res.status(200).json({ data: usuarios });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno ao buscar usuários' });
    }
};

const buscarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obterUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json({ data: usuario });
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar usuário' });
    }
};

const criarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, foto } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }
        const hash = await bcrypt.hash(senha, 10);
        const usuario = await usuarioService.criarUsuario({ nome, email, senha, foto: foto || null });
        return res.status(201).json({ data: usuario, message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Já existe um usuário com este email' });
        }

        return res.status(500).json({ error: 'Erro interno ao criar usuário' });
    }
};

const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, foto } = req.body;

        const usuarioAtualizado = await usuarioService.atualizarUsuario(id, {
            nome,
            email,
            senha,
            foto: foto || null,
        });

        if (!usuarioAtualizado) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json({ data: usuarioAtualizado, message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Já existe um usuário com este email' });
        }

        return res.status(500).json({ error: 'Erro interno ao atualizar usuário' });
    }
};

const excluirUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioExcluido = await usuarioService.excluirUsuario(id);

        if (!usuarioExcluido) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json({ data: usuarioExcluido, message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        return res.status(500).json({ error: 'Erro interno ao excluir usuário' });
    }
};

module.exports = {
    buscarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario,
};