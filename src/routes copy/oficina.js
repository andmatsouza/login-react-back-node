const { Router } = require("express");
const oficinaController = require("../controllers/oficina");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/oficina", eAdmin, oficinaController.AddOficina);
router.get("/oficinas/:page", eAdmin, oficinaController.getOficinas);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
