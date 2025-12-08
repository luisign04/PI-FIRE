"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Não autenticado" });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Acesso negado" });
    }
    next();
};
exports.authorize = authorize;
//# sourceMappingURL=roles.js.map