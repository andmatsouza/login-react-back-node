const { Router } = require("express");
const fabricanteController = require("../controllers/fabricante");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/fabricante", eAdmin, fabricanteController.AddFabricante);
router.get("/fabricantes/:page", eAdmin, fabricanteController.getFabricantes);
router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
