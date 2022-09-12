const { Router } = require("express");
const fabricanteController = require("../controllers/fabricante");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/api/fabricante", eAdmin, fabricanteController.AddFabricante);
router.get("/api/fabricantes/:page", eAdmin, fabricanteController.getFabricantes);
router.get("/api/fabricante/:id", eAdmin, fabricanteController.getFabricante);
router.put("/api/fabricante", eAdmin, fabricanteController.setFabricante);
router.put("/api/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
