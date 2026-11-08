'use strict';

const columns = {
  rua: { type: 'STRING', length: 255 },
  numero: { type: 'STRING', length: 50 },
  bairro: { type: 'STRING', length: 150 },
  cidade: { type: 'STRING', length: 150 },
  estado: { type: 'STRING', length: 100 },
  cep: { type: 'STRING', length: 20 },
  pais: { type: 'STRING', length: 100 }
};

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const [column, definition] of Object.entries(columns)) {
      await queryInterface.addColumn('usuarios', column, {
        type: Sequelize[definition.type](definition.length),
        allowNull: true
      });
    }
  },

  async down(queryInterface) {
    for (const column of Object.keys(columns).reverse()) {
      await queryInterface.removeColumn('usuarios', column);
    }
  }
};