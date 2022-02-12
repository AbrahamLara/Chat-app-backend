const mockUsers = require('../sample_data/mock-users.json');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Users', mockUsers, {});
  },

  down: async () => {},
};
