import { Request, Response, NextFunction } from 'express';
import { AuthUser } from '../types/user';
export interface AuthRequest extends Request {
    user?: AuthUser;
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map