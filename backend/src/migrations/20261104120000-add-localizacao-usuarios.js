'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'endereco', {
      type: Sequelize.STRING(500),
      allowNull: true
    });
    await queryInterface.addColumn('usuarios', 'latitude', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true
    });
    await queryInterface.addColumn('usuarios', 'longitude', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'longitude');
    await queryInterface.removeColumn('usuarios', 'latitude');
    await queryInterface.removeColumn('usuarios', 'endereco');
  }
};