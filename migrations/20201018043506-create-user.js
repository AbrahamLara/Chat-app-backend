module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'Users',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        indexes: [
          // Create a trigram-based gin index.d.ts on the name column for very fast similarity searches.
          // Docs: https://www.postgresql.org/docs/11/pgtrgm.html#id-1.11.7.40.7
          {
            name: 'users_name_trigram',
            using: 'GIN',
            concurrently: true,
            fields: [Sequelize.literal('name gin_trgm_ops')],
          },
        ],
      }
    );
  },
  down: async queryInterface => {
    await queryInterface.dropTable('Users');
  },
};
