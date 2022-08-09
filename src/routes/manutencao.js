const { Router } = require("express");
const manutencaoController = require("../controllers/manutencao");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/manutencao", eAdmin, manutencaoController.AddManutencao);
//router.get("/fabricantes/:page", eAdmin, fabricanteController.getFabricantes);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
