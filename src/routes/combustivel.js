const { Router } = require("express");
const combustivelController = require("../controllers/combustivel");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/combustivel", eAdmin, combustivelController.AddCombustivel);
router.get("/combustiveis", eAdmin, combustivelController.getCombustiveis);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
