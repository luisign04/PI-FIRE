import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth";

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
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
