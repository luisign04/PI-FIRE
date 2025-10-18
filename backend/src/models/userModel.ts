// src/models/userModel.ts

import db from '../database/connection';
import { User } from '../types/user';

export class UserModel {
    
    // Busca um usuário pelo email (essencial para o login)
    async findByEmail(email: string): Promise<User | undefined> {
        return db('users').where({ email }).first();
    }

    // Cria um novo usuário (recebe o hash pronto do AuthService)
    async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
        const userWithDefaultRole = { 
            ...userData, 
            role: userData.role || 'firefighter' 
        };
        
        // Retorna o ID do usuário recém-criado
        const [id] = await db('users').insert(userWithDefaultRole);
        
        // CORREÇÃO AQUI: Verificamos o ID para garantir que ele é um número válido.
        if (typeof id === 'number') {
            return id;
        }

        // Se o Knex não retornar um ID válido (o que é raro, mas possível), lançamos um erro.
        throw new Error('Falha ao inserir usuário: ID de inserção inválido ou não retornado.');
    }
}

export const userModel = new UserModel();