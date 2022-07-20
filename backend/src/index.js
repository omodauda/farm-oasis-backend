import dotenv from 'dotenv';
import regeneratorRuntime from 'regenerator-runtime';
import app from './app';

dotenv.config();
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
