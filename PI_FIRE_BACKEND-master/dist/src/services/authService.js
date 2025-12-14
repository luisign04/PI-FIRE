"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel"); // Importa o modelo para interação com o DB
// CHAVE SECRETA para assinar os tokens (DEVE vir de variáveis de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-forte-aqui';
class AuthService {
    // 1. REGISTRO (Cria o hash da senha e gera o token)
    async register(name, email, password_input, role = 'firefighter') {
        // ... (Verificação se o usuário existe)
        // Gera o hash seguro da senha
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password_input, saltRounds);
        // CORREÇÃO AQUI: Afirmamos que a variável 'role' é do tipo correto
        const userRole = role;
        // Salva no banco de dados, usando a role tipada corretamente
        const id = await userModel_1.userModel.create({ name, email, password_hash, role: userRole });
        // Gera o token de acesso
        const user = { id, name, email, role: userRole };
        const token = this.generateToken(user);
        return { user, token };
    }
    // 2. LOGIN (Compara o hash da senha e gera o token)
    async login(email, password_input) {
        const user = await userModel_1.userModel.findByEmail(email);
        // Se o email não existir ou a senha não bater, retorna erro genérico por segurança
        if (!user) {
            throw new Error('Credenciais inválidas');
        }
        // Compara a senha digitada com o hash salvo usando bcrypt
        const isMatch = await bcrypt.compare(password_input, user.password_hash);
        if (!isMatch) {
            throw new Error('Credenciais inválidas');
        }
        // Gera o token de acesso
        const authUser = { id: user.id, name: user.name, email: user.email, role: user.role };
        const token = this.generateToken(authUser);
        return { user: authUser, token };
    }
    // 3. GERAÇÃO DE TOKEN (Assina o token)
    generateToken(user) {
        return jwt.sign(user, JWT_SECRET, { expiresIn: '1d' });
    }
    // 4. VERIFICAÇÃO DE TOKEN (Usado pelo middleware)
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map