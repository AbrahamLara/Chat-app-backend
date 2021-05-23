import { createServer } from './server';

const PORT = 5000;

createServer().listen(PORT, () => console.log(`Listening on port ${PORT}`));
