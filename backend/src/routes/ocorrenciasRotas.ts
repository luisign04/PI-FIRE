import {Router} from 'express'
import { OcorrenciaController } from '../controllers/ocorrenciaController'

const router = Router();

router.post('/ocorrencias', new OcorrenciaController().create);
router.get('/ocorrencias', new OcorrenciaController().list);

export default router;