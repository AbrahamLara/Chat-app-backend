import { createServer } from './server';
import { sequelize } from '../models';

const PORT = 5000;

sequelize.sync().then(() => {
  createServer().listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
