const {DataTypes, Model} = require('sequelize');
const {sequelize} = require('../instances/mysql');

class Usuario extends Model {}

Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foto: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    endereco: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    rua: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    numero: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    bairro: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    cidade: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    cep: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    pais: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    precisaoLocalizacao: {
        type: DataTypes.STRING(20),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true
}
);

module.exports = Usuario;