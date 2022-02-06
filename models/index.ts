import { DataTypes, Sequelize } from 'sequelize';
import User from './user-model';
import Chat from './chat-model';
import UserChat from './user-chat-model';
import Message from './message-model';
import MessageRecipient from './messagerecipient-model';
import { Models } from '../src/utils/database-utils';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Get the env config from config.json
const config = require('../config/config.json')[NODE_ENV];
// Connect to the database.
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const models: Models = {
  User: User(sequelize, DataTypes),
  Chat: Chat(sequelize, DataTypes),
  UserChat: UserChat(sequelize),
  Message: Message(sequelize, DataTypes),
  MessageRecipient: MessageRecipient(sequelize),
};
// Begin to make associations between models if there is a model that requires it.
Object.keys(models).forEach(modelName => {
  const model = models[modelName as keyof Models];
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, Sequelize, models };
