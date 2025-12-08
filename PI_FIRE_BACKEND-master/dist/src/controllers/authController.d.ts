import { Request, Response } from 'express';
export declare const authController: {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    verify(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=authController.d.ts.map