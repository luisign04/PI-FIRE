"use strict";
// src/models/userModel.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.UserModel = void 0;
const connection_1 = __importDefault(require("../database/connection"));
class UserModel {
    // Busca um usuário pelo email (essencial para o login)
    async findByEmail(email) {
        return (0, connection_1.default)('users').where({ email }).first();
    }
    // Cria um novo usuário (recebe o hash pronto do AuthService)
    async create(userData) {
        const userWithDefaultRole = {
            ...userData,
            role: userData.role || 'firefighter'
        };
        // Retorna o ID do usuário recém-criado
        const [id] = await (0, connection_1.default)('users').insert(userWithDefaultRole);
        // CORREÇÃO AQUI: Verificamos o ID para garantir que ele é um número válido.
        if (typeof id === 'number') {
            return id;
        }
        // Se o Knex não retornar um ID válido (o que é raro, mas possível), lançamos um erro.
        throw new Error('Falha ao inserir usuário: ID de inserção inválido ou não retornado.');
    }
}
exports.UserModel = UserModel;
exports.userModel = new UserModel();
//# sourceMappingURL=userModel.js.map