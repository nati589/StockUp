import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectMongo } from './config/mongo.js';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import expensesRoutes from './routes/expenses.routes.js';
import usersRoutes from './routes/users.routes.js';
import salesRoutes from './routes/sales.routes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || '*').split(','),
    credentials: true
  })
);
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/sales', salesRoutes);

const port = process.env.PORT || 4000;

connectMongo(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });