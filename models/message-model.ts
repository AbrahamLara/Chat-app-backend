import { Sequelize, UUID, UUIDV4 } from 'sequelize';
import { DataTypes, Models, SequelizeModel } from '../src/utils/database-utils';

export default function (
  sequelize: Sequelize,
  types: DataTypes
): typeof SequelizeModel {
  class Message extends SequelizeModel {
    /**
     * Helper method for defining associations.
     * This method is not a p art of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Models) {
      // define association here
      Message.belongsTo(models.User, {
        foreignKey: 'userID',
        targetKey: 'id',
      });
      Message.belongsTo(models.Chat, {
        foreignKey: 'chatID',
        targetKey: 'id',
      });
      Message.belongsToMany(models.User, {
        through: models.MessageRecipient,
        foreignKey: 'messageID',
      });
    }
  }
  Message.init(
    {
      id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      message: {
        type: types.STRING,
        allowNull: false,
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
      modelName: 'Message',
    }
  );
  return Message;
}
