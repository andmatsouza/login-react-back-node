const { Router } = require("express");
const veiculoController = require("../controllers/veiculo");

const { eAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/api/veiculo", eAdmin, veiculoController.AddVeiculo);
router.get("/api/veiculos/:page", eAdmin, veiculoController.getVeiculos);
router.get("/api/veiculo/:id/:mes/:ano", eAdmin, veiculoController.getVeiculo);
router.get("/api/veiculo-abast/:dtInicio/:dtFinal", eAdmin, veiculoController.getVeiculosTime);
router.get("/api/veiculo-mnt/:dtInicio/:dtFinal", eAdmin, veiculoController.getVeiculosMntTime);
router.get("/api/veiculo/:id", eAdmin, veiculoController.getVeiculo1);
router.put("/api/veiculo/:id", eAdmin, veiculoController.setVeiculoId); 

module.exports = router;
