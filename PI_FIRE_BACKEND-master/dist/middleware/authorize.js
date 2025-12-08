"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado." });
        }
        // req.user.role vem do token
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Acesso negado." });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map