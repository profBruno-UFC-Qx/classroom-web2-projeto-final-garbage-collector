import "reflect-metadata"; 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API rodando!' });
});

export default app;