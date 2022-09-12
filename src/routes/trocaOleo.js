const { Router } = require("express");
const trocaOleoController = require("../controllers/trocaOleo");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/api/trocaoleo", eAdmin, trocaOleoController.AddTrocaOleo);
//router.get("/fabricantes/:page", eAdmin, fabricanteController.getFabricantes);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
