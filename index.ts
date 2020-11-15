import express from 'express';
import auth from './api/auth';

const PORT = 5000;
const app = express();

app.use(express.json());
// api routes
app.use('/api/auth', auth);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
