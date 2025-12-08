// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AuthUser } from '../types/user';

// Estende a Requisição para incluir o usuário decodificado
export interface AuthRequest extends Request {
    user?: AuthUser;
}

// O middleware DEVE ser exportado como 'protect' para que suas rotas o encontrem.
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    // 1. Verifica se o header existe
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1]!;
    
    // 2. Verifica e decodifica o token usando o AuthService
    const user = authService.verifyToken(token);

    if (!user) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    // 3. Anexa o usuário à requisição (req.user)
    req.user = user;
    
    // 4. Prossegue para o Controller
    next();
};