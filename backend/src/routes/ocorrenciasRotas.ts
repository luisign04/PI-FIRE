// src/routes/ocorrenciasRoutes.ts
import { Router } from 'express';
import { ocorrenciaController } from '../controllers/ocorrenciaController';

const router = Router();

router.post('/ocorrencias', ocorrenciaController.create);
router.get('/ocorrencias', ocorrenciaController.list);
router.get('/ocorrencias/:id', ocorrenciaController.getById);

export default router;