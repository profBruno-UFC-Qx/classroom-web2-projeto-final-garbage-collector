import "reflect-metadata"; 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import { handleError } from "./middlewares/handleError";

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API rodando!' });
});

app.use(handleError);

export default app;