import express from 'express';
import cors from 'cors';
import ocorrenciasRotas from './routes/ocorrenciasRotas';
import authRoutes from './routes/authRoutes';
import path from 'path';


const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// Rotas
app.use('/api', ocorrenciasRotas);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running on port 3333' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});