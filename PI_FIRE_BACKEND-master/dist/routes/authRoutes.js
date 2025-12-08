"use strict";
// src/routes/authRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth"); // ⬅️ Importa o middleware
const authorize_1 = require("../middleware/authorize");
const router = (0, express_1.Router)();
// 1. Rota de Registro (Não precisa de autenticação para se registrar)
router.post('/register', authController_1.authController.register);
// 2. Rota de Login (Não precisa de autenticação para logar)
router.post('/login', authController_1.authController.login);
// 3. Rota de Verificação (Precisa do middleware para verificar o token)
// O middleware 'protect' garante que o token no header é válido antes de chamar o controller.
router.get('/verify', auth_1.protect, authController_1.authController.verify);
router.get("/admin/usuarios", auth_1.protect, (0, authorize_1.authorize)("admin"), (req, res) => {
    res.json({ msg: "Acesso do administrador liberado." });
});
router.get("/perfil", auth_1.protect, (0, authorize_1.authorize)("admin", "firefighter"), (req, res) => {
    res.json({ msg: "Acesso permitido aos usuários." });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map