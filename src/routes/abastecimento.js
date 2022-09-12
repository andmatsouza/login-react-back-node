const { Router } = require("express");
const abastecimentoController = require("../controllers/abastecimento");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/api/abastecimento", eAdmin, abastecimentoController.AddAbastecimento);
//router.get("/fabricantes/:page", eAdmin, fabricanteController.getFabricantes);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
