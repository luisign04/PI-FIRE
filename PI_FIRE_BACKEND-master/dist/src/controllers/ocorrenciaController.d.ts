import { Request, Response } from 'express';
export declare const ocorrenciaController: {
    create(req: Request, res: Response): Promise<void>;
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    filter(req: Request, res: Response): Promise<void>;
    advancedFilter(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getStats(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=ocorrenciaController.d.ts.map