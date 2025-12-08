declare module '../controllers/ocorrenciaController' {
  import { Request, Response } from 'express';
  
  export const ocorrenciaController: {
    create(req: Request, res: Response): Promise<void>;
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    filter(req: Request, res: Response): Promise<void>;
    advancedFilter(req: Request, res: Response): Promise<void>; // ADICIONADO
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
  };
}