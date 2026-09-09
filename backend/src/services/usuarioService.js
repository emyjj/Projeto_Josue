const Usuario = require('../models/Usuario');

const obterTodosUsuarios = async () => {
    return await Usuario.findAll({
        attributes: { exclude: ['senha'] }
    });
};

const obterUsuarioPorId = async (id) => {
    return await Usuario.findByPk(id, {
        attributes: { exclude: ['senha'] }
    });
};

const criarUsuario = async (dadosUsuario) => {
    return await Usuario.create(dadosUsuario);
};

const atualizarUsuario = async (id, dadosUsuario) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return null;
    }

    await usuario.update(dadosUsuario);
    return await Usuario.findByPk(id, {
        attributes: { exclude: ['senha'] }
    });
};

const excluirUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return null;
    }

    await usuario.destroy();
    return usuario;
};

module.exports = {
    obterTodosUsuarios,
    obterUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario,
};