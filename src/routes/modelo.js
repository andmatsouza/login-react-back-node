const { Router } = require("express");
const modeloController = require("../controllers/modelo");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/api/modelo", eAdmin, modeloController.AddModelo);
router.get("/api/modelos/:page", eAdmin, modeloController.getModelos);
router.get("/api/modelo/:id", eAdmin, modeloController.getModelo);
router.put("/api/modelo", eAdmin, modeloController.setModelo);
router.delete("/api/modelo/:id", eAdmin, modeloController.deleteModelo);   

module.exports = router;
