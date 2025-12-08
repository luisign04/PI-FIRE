// src/controllers/authController.ts

import { Request, Response } from 'express';
// Importamos o Service que contém toda a lógica de segurança
import { authService } from '../services/authService'; 

export const authController = {
  
  // 1. REGISTRO DE NOVO USUÁRIO
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
      }

      // Delega o trabalho de hashing e salvar no DB para o Service
      const result = await authService.register(name, email, password, role);

      // Retorna 201 Created com o token e dados do usuário
      res.status(201).json({
        success: true,
        message: 'Registro realizado com sucesso!',
        token: result.token,
        user: result.user,
      });

    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
      if (error.message.includes('Usuário já existe')) {
          return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
  },

  // 2. LOGIN DE USUÁRIO
  async login(req: Request, res: Response) {
    try {
      // Usamos 'email' como identificador, conforme definimos no Service e no Model
      const { email, password } = req.body; 

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      }

      // Delega o trabalho de buscar no DB e comparar o hash para o Service
      const result = await authService.login(email, password);
      
      // Retorna 200 OK com o token e dados do usuário
      res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        token: result.token,
        user: result.user,
      });

    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      if (error.message.includes('Credenciais inválidas')) {
          return res.status(401).json({ error: error.message }); // 401 Unauthorized
      }
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

  // 3. VERIFICAÇÃO DE TOKEN (Usado para o health check do token)
  async verify(req: Request, res: Response) {
    // Se o middleware 'protect' passar, significa que o token é válido
    res.json({ success: true, message: 'Token válido' });
  }
};