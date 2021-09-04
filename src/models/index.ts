import { DataTypes, Sequelize } from 'sequelize';
import User from './user-model';
import { Models } from '../utils/database-utils';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Get the env config from config.json
const config = require('../../config/config.json')[NODE_ENV];
// Connect to the database.
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const models: Models = {
  User: User(sequelize, DataTypes),
};
// Begin to make associations between models if there is a model that requires it.
Object.keys(models).forEach(modelName => {
  const model = models[modelName];
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, Sequelize, models };
