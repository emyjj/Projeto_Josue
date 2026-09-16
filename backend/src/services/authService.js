const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const login = async (email, senha) => {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        throw new Error('Credenciais inválidas');
        
        const confere = await bcrypt.compare(senha, usuario.senha);
        if (!confere) {
            throw new Error('Credenciais inválidas');
        }

        return {nome: usuario.nome, email: usuario.email};
    }
}