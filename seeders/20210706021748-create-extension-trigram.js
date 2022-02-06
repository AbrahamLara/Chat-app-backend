module.exports = {
  up: async queryInterface => {
    // PostgreSQL Trigram docs: https://www.postgresql.org/docs/11/pgtrgm.html
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS pg_trgm;'
    );
  },

  down: async queryInterface => {
    await queryInterface.sequelize.query(
      'DROP EXTENSION IF EXISTS pg_trgm CASCADE;'
    );
  },
};
