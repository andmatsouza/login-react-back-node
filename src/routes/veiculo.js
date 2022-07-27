const { Router } = require("express");
const veiculoController = require("../controllers/veiculo");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/veiculo", eAdmin, veiculoController.AddVeiculo);
router.get("/veiculos/:page", eAdmin, veiculoController.getVeiculos);
router.put("/veiculo/:id", eAdmin, veiculoController.settVeiculoId); 

module.exports = router;
