import express from 'express';
import { sequelize } from './database/models';

const app = express();
const ENV = process.env.NODE_ENV;

app.use(express.json());

async function init_db() {
  if (ENV === 'development') {
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
    } catch (error) {
      console.error('Unable to connect to database:', error);
    }
  }
}

init_db();

export default app;
