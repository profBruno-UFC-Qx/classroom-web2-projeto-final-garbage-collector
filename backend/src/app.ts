import "reflect-metadata"; 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API rodando!' });
});

export default app;