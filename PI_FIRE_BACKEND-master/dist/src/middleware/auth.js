"use strict";
// src/middleware/auth.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const authService_1 = require("../services/authService");
// O middleware DEVE ser exportado como 'protect' para que suas rotas o encontrem.
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // 1. Verifica se o header existe
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    // 2. Verifica e decodifica o token usando o AuthService
    const user = authService_1.authService.verifyToken(token);
    if (!user) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    // 3. Anexa o usuário à requisição (req.user)
    req.user = user;
    // 4. Prossegue para o Controller
    next();
};
exports.protect = protect;
//# sourceMappingURL=auth.js.map