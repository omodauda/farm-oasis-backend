import express from 'express';
import { sequelize } from './database/models';
import routes from './routes';

const app = express();
const ENV = process.env.NODE_ENV;

app.use(express.json());

app.get('/home', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'welcome to farm oasis',
  });
});
app.use('/api/v1/', routes);

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
