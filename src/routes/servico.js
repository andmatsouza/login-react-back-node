const { Router } = require("express");
const servicoController = require("../controllers/servico");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/api/servico", eAdmin, servicoController.AddServico);
router.get("/api/servicos", eAdmin, servicoController.getServicos);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
