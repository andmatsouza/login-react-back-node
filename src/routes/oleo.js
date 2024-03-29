const { Router } = require("express");
const oleoController = require("../controllers/oleo");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/api/oleo", eAdmin, oleoController.AddOleo);
router.get("/api/oleos", eAdmin, oleoController.getOleos);
//router.get("/fabricante/:id", eAdmin, fabricanteController.getFabricante);
//router.put("/fabricante", eAdmin, fabricanteController.setFabricante);
//router.put("/fabricante/:id", eAdmin, fabricanteController.setFabricanteId);   

module.exports = router;
