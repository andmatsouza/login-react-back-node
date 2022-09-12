const { Router } = require("express");
const servicoController = require("../controllers/servico");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/servico", eAdmin, servicoController.AddServico);
router.get("/servicos", eAdmin, servicoController.getServicos);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
