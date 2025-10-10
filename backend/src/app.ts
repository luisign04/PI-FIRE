// src/app.ts
import express from 'express';
import cors from 'cors';
import ocorrenciasRotas from './routes/ocorrenciasRotas';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Rotas oficiais
app.use('/api', ocorrenciasRotas);

// Health check (manter)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});