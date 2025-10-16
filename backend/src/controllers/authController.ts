import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Usuários mockados - depois vamos mover para o banco
const users = [
  {
    id: 1,
    username: 'bombeiro',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'bombeiro'
  },
  {
    id: 2,
    username: 'admin',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin'
  }
];

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Validar campos
      if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
      }

      // Encontrar usuário
      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'secret_fallback',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async verify(req: Request, res: Response) {
    // Rota para verificar se o token é válido
    res.json({ success: true, message: 'Token válido' });
  }
};