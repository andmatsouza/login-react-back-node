const { Router } = require("express");
const veiculoController = require("../controllers/veiculo");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/veiculo", eAdmin, veiculoController.AddVeiculo);
router.get("/veiculos/:page", eAdmin, veiculoController.getVeiculos);
router.get("/veiculo/:id/:mes/:ano", eAdmin, veiculoController.getVeiculo);
router.get("/veiculo-abast/:dtInicio/:dtFinal", eAdmin, veiculoController.getVeiculosTime);
router.get("/veiculo/:id", eAdmin, veiculoController.getVeiculo1);
router.put("/veiculo/:id", eAdmin, veiculoController.setVeiculoId); 

module.exports = router;
