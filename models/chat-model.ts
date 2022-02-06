import { Sequelize, UUID, UUIDV4 } from 'sequelize';
import { DataTypes, Models, SequelizeModel } from '../src/utils/database-utils';

export default function (
  sequelize: Sequelize,
  types: DataTypes
): typeof SequelizeModel {
  class Chat extends SequelizeModel {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static associate(models: Models) {
      Chat.belongsToMany(models.User, {
        through: models.UserChat,
        foreignKey: 'chatID',
      });
    }
  }

  Chat.init(
    {
      id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      isGroup: {
        type: types.BOOLEAN,
        allowNull: false,
      },
      name: {
        type: types.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Chat',
    }
  );
  return Chat;
}
