"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/ocorrenciasRoutes.ts
const express_1 = require("express");
const ocorrenciaController_1 = require("../controllers/ocorrenciaController");
const multer_1 = require("../config/multer");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// ✅ ROTAS PROTEGIDAS
router.post("/ocorrencias/public", multer_1.upload.single("foto"), ocorrenciaController_1.ocorrenciaController.create);
router.post("/ocorrencias", multer_1.upload.single("foto"), ocorrenciaController_1.ocorrenciaController.create);
router.get("/ocorrencias", auth_1.protect, ocorrenciaController_1.ocorrenciaController.list);
router.get("/ocorrencias/filter", auth_1.protect, ocorrenciaController_1.ocorrenciaController.filter);
router.get("/ocorrencias/:id", auth_1.protect, ocorrenciaController_1.ocorrenciaController.getById);
router.put("/ocorrencias/:id", auth_1.protect, multer_1.upload.single("foto"), ocorrenciaController_1.ocorrenciaController.update);
router.delete("/ocorrencias/:id", auth_1.protect, ocorrenciaController_1.ocorrenciaController.delete);
// ✅ ROTAS DE DASHBOARD E BUSCA
router.get("/stats/dashboard", ocorrenciaController_1.ocorrenciaController.getStats); // SEM protect
router.get("/filter/advanced", ocorrenciaController_1.ocorrenciaController.advancedFilter);
// ✅ ROTA DE TESTE PÚBLICA
router.get("/teste-publico", (req, res) => {
    res.json({ mensagem: "Rota pública funcionando!", data: new Date() });
});
exports.default = router;
//# sourceMappingURL=ocorrenciasRotas.js.map