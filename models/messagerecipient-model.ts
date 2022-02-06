import { Sequelize, UUID, UUIDV4 } from 'sequelize';
import { Models, SequelizeModel } from '../src/utils/database-utils';

export default function (sequelize: Sequelize): typeof SequelizeModel {
  class MessageRecipient extends SequelizeModel {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Models) {
      MessageRecipient.belongsTo(models.User, {
        foreignKey: 'userID',
        targetKey: 'id',
      });
      MessageRecipient.belongsTo(models.UserChat, {
        foreignKey: 'userChatID',
        targetKey: 'id',
      });
      MessageRecipient.belongsTo(models.Message, {
        foreignKey: 'messageID',
        targetKey: 'id',
      });
    }
  }
  MessageRecipient.init(
    {
      id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      userID: {
        type: UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      userChatID: {
        type: UUID,
        allowNull: false,
        references: {
          model: 'UserChats',
          key: 'id',
        },
      },
      messageID: {
        type: UUID,
        allowNull: false,
        references: {
          model: 'Messages',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'MessageRecipient',
    }
  );
  return MessageRecipient;
}
