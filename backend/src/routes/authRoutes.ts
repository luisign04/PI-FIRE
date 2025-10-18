// src/routes/authRoutes.ts

import { Router } from 'express';
import { authController } from '../controllers/authController';
import { protect } from '../middleware/auth'; // ⬅️ Importa o middleware

const router = Router();

// 1. Rota de Registro (Não precisa de autenticação para se registrar)
router.post('/register', authController.register);

// 2. Rota de Login (Não precisa de autenticação para logar)
router.post('/login', authController.login);

// 3. Rota de Verificação (Precisa do middleware para verificar o token)
// O middleware 'protect' garante que o token no header é válido antes de chamar o controller.
router.get('/verify', protect, authController.verify); 

export default router;