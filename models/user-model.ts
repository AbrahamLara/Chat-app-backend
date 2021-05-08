import { Sequelize, UUID, UUIDV4 } from 'sequelize';
import { DataTypes, Models, SequelizeModel } from '../utils/database-utils';

export default function(
  sequelize: Sequelize,
  types: DataTypes
): typeof SequelizeModel {
  class User extends SequelizeModel {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static associate(models: Models) {
      // Defined model associations
    }
  }

  User.init(
    {
      id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      name: {
        type: types.STRING,
        allowNull: false,
      },
      email: {
        type: types.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: types.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
}
