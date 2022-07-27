const yup = require("yup");

const repository = require("../models/VeiculoRepository");

async function AddVeiculo(req, res) {
  var dados = req.body;

  const schema = yup.object().shape({   
    
    placa: yup
      .string("Erro: Necessário preencher o campo placa!")
      .required("Erro: Necessário preencher o campo placa!"),
    renavam: yup
      .string("Erro: Necessário preencher o campo renavam!")
      .required("Erro: Necessário preencher o campo renavam!"),
    ano_fabricacao: yup
      .string("Erro: Necessário preencher o campo ano de fabricação!")
      .required("Erro: Necessário preencher o campo ano de fabricação!"),
    fabricanteId: yup
      .string("Erro: Necessário preencher o campo nome do fabricante!")
      .required("Erro: Necessário preencher o campo nome do fabricante!"),
    modeloId: yup
      .string("Erro: Necessário preencher o campo modelo do fabricante!")
      .required("Erro: Necessário preencher o campo modelo do fabricante!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  const veiculo = await repository.findOneVeiculo(req.body.placa);

  if (veiculo) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este veículo já está cadastrado!",
    });
  }  

  await repository.add(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Veículo cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Veículo não cadastrado com sucesso!",
      });
    });
};

async function getVeiculos(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countVeiculo = await repository.countVeiculo();
  if (countVeiculo === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum veículo encontrado!",
    });
  } else {
    lastPage = Math.ceil(countVeiculo / limit);
  }

  await repository.findAll()
    .then((veiculos) => {
      return res.json({
        erro: false,
        veiculos,
        countVeiculo,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum veículo encontrado!",
      });
    });
};

async function settVeiculoId(req, res) {
  const { id } = req.params;

  const veiculo = await repository.findOneVeiculoId(id);
  
  veiculo.status = 2;
  
  await veiculo.save()
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Veículo apagado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Veículo não apagado com sucesso!",
      });
    });
};

module.exports = {AddVeiculo,
                  getVeiculos,
                  settVeiculoId,                 
                  };