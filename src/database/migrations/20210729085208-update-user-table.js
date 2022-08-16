'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users', 'address', {type: Sequelize.STRING})
    await queryInterface.addColumn('Users', 'gender', {type: Sequelize.STRING})
    await queryInterface.addColumn('Users', 'dateOfBirth', {type: Sequelize.DATEONLY})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Users', 'address')
    await queryInterface.removeColumn('Users', 'gender')
    await queryInterface.removeColumn('Users', 'dateOfBirth')
  }
};
