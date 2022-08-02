const { Router } = require("express");
const postoController = require("../controllers/posto");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/posto", eAdmin, postoController.AddPosto);
router.get("/postos/:page", eAdmin, postoController.getPostos);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
