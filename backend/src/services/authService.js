const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const login = async (email, senha) => {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        throw new Error('Credenciais inválidas');
    }

    const confere = await bcrypt.compare(senha, usuario.senha);
    if (!confere) {
        throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { token, usuario: { id: usuario.id, nome: usuario.nome } };
};

module.exports = { login };