import { Sequelize, UUID, UUIDV4 } from 'sequelize';
import { Models, SequelizeModel } from '../src/utils/database-utils';

export default function (sequelize: Sequelize): typeof SequelizeModel {
  class UserChat extends SequelizeModel {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static associate(models: Models) {
      UserChat.belongsTo(models.User, {
        foreignKey: 'userID',
        targetKey: 'id',
      });
      UserChat.belongsTo(models.Chat, {
        foreignKey: 'chatID',
        targetKey: 'id',
      });
      UserChat.hasMany(models.MessageRecipient, {
        foreignKey: 'userChatID',
        sourceKey: 'id',
      });
    }
  }
  UserChat.init(
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
      chatID: {
        type: UUID,
        allowNull: false,
        references: {
          model: 'Chats',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'UserChat',
    }
  );
  return UserChat;
}
