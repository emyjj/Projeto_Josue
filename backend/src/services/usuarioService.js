const Usuario = require('../models/Usuario');

const obterTodosUsuarios = async () => {
    return await Usuario.findAll();
};

module.exports = {
    obterTodosUsuarios,
};