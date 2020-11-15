import { Model, Sequelize } from 'sequelize';
import * as SequelizeDataTypes from 'sequelize/types/lib/data-types';

/**
 * Database models that can be used for querying.
 */
type Models = {
  [key: string]: typeof SequelizeModel;
};

/**
 * The sequelize database model with a static associate method for code completion.
 */
class SequelizeModel extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: Models): void {}
}

/**
 * Sequelize data types to reference for all models.
 */
type DataTypes = typeof SequelizeDataTypes;

export { SequelizeModel, Sequelize, DataTypes, Models };
