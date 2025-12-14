// src/routes/ocorrenciasRoutes.ts
import { Router } from "express";
import { ocorrenciaController } from "../controllers/ocorrenciaController";
import { upload } from "../config/multer";
import { protect } from "../middleware/auth";

const router = Router();

// ✅ ROTAS PROTEGIDAS
router.post("/ocorrencias/public", upload.single("foto"), ocorrenciaController.create);
router.post("/ocorrencias", upload.single("foto"), ocorrenciaController.create);
router.get("/ocorrencias", protect, ocorrenciaController.list);
router.get("/ocorrencias/filter", protect, ocorrenciaController.filter);
router.get("/ocorrencias/:id", protect, ocorrenciaController.getById);
router.put("/ocorrencias/:id", protect, upload.single("foto"), ocorrenciaController.update);
router.delete("/ocorrencias/:id", protect, ocorrenciaController.delete);

// ✅ ROTAS DE DASHBOARD E BUSCA
router.get("/stats/dashboard", ocorrenciaController.getStats); // SEM protect
router.get("/filter/advanced", ocorrenciaController.advancedFilter);

// ✅ ROTA PARA MACHINE LEARNING
router.get("/ml/training-data", ocorrenciaController.getMLTrainingData); // Dados para treinar ML

// ✅ ROTA DE TESTE PÚBLICA
router.get("/teste-publico", (req, res) => {
  res.json({ mensagem: "Rota pública funcionando!", data: new Date() });
});

export default router;
