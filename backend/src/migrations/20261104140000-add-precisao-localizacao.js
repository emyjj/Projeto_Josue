'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'precisaoLocalizacao', {
      type: Sequelize.STRING(20),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'precisaoLocalizacao');
  }
};