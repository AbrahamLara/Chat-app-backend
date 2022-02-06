module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MessageRecipients', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      userChatID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'UserChats',
          key: 'id',
        },
      },
      messageID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Messages',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('MessageRecipients');
  },
};
