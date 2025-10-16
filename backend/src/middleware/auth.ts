import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: { id: number; username: string; role: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }

  // Verificar token JWT (implementaremos depois)
  // Por enquanto, vamos usar uma autenticação básica
  next();
};