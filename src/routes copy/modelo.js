const { Router } = require("express");
const modeloController = require("../controllers/modelo");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/modelo", eAdmin, modeloController.AddModelo);
router.get("/modelos/:page", eAdmin, modeloController.getModelos);
router.get("/modelo/:id", eAdmin, modeloController.getModelo);
router.put("/modelo", eAdmin, modeloController.setModelo);
router.delete("/modelo/:id", eAdmin, modeloController.deleteModelo);   

module.exports = router;
