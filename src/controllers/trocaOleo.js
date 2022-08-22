const express = require("express");
const app = express();
const yup = require("yup");
require("dotenv").config();
//const fs = require('fs');
const path = require('path');
app.use('/files', express.static(path.resolve(__dirname,"public", "upload")));

const repository = require("../models/TrocaOleoRepository");


async function AddTrocaOleo(req, res) {
  var dados = req.body;

  const schema = yup.object().shape({    
     
      valor_troca: yup.number().typeError('Digite o valor da troca de óleo').required().positive("O campo troca de óleo deve ser positivo."),
      odometro_atual: yup.number().typeError('Digite o valor da Km atual').required().positive("O campo Km atual deve ser positivo.").integer("O campo Km atual deve ser um número inteiro."),
      odometro_troca: yup.number().typeError('Digite o valor da Km trocaaaa').required().positive("O campo Km troca deve ser positivo.").integer("O campo Km troca deve ser um número inteiro."),
      filtro_oleo: yup.number().typeError('Selecione Sim ou Não').required("O campo filtrro de óleo é obrigatório.").positive("O campofiltro de óleo deve ser positivo.").integer("O campo filtro de óleo deve ser um número inteiro."),
      filtro_combustivel: yup.number().typeError('Selecione Sim ou Não').required("O campo filtrro de combustível é obrigatório.").positive("O campofiltro de combustível deve ser positivo.").integer("O campo filtro de combustível deve ser um número inteiro."),     
      oleoId: yup.number().typeError('Selecione um Óleo').required("O campo óleo é obrigatório.").positive("O campo óleo deve ser positivo.").integer("O campo óleo deve ser um número inteiro."),
      oficinaId: yup.number().typeError('Selecione um Posto').required("O campo posto é obrigatório.").positive("O campo posto deve ser positivo.").integer("O campo posto deve ser um número inteiro."),
      veiculoId: yup.number().typeError('Selecione um Veiculo').required("O campo veículo é obrigatório.").positive("O campo veículo deve ser positivo.").integer("O campo veículo deve ser um número inteiro."),     
      data_troca: yup.date().typeError('Digite uma Data de Troca válida').required(),   
   
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  /*const abastecimento = await repository.findOneCombustivel(req.body.nome_combustivel);

  if (combustivel) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este combustível já está cadastrado!",
    });
  }*/

  await repository.add(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Troca de óleo cadastrada com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Troca de óleo não cadastrada com sucesso!",
      });
    });
};

/*async function getFabricantes(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countFabricante = await repository.countFabricante();
  if (countFabricante === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum fabricante encontrado!",
    });
  } else {
    lastPage = Math.ceil(countFabricante / limit);
  }

  await repository.findAll(page)
    .then((fabricantes) => {
      return res.json({
        erro: false,
        fabricantes,
        countFabricante,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum fabricante encontrado!",
      });
    });
};

async function getFabricante(req, res) {
  const { id } = req.params;

  await repository.findById(id)
    .then((fabricante) => {       
      return res.json({
        erro: false,
        fabricante: fabricante        
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum fabricante encontrado!",
      });
    });
};

async function setFabricante(req, res) {
  const { id } = req.body;
  const dados = req.body;

  const schema = yup.object().shape({   
    nome_fabricante: yup
      .string("Erro: Necessário preencher o campo nome do fabricante!")
      .required("Erro: Necessário preencher o campo nome do fabricante!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  } 

  const fabricante = await repository.findOneFabricanteId(req.body.nome_fabricante, id);

  if (fabricante) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este fabricante já está cadastrado!",
    });
  }

  await repository.set(dados, id)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Fabricante editado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Fabricante não editado com sucesso!",
      });
    });
};


async function setFabricanteId(req, res) {
  const { id } = req.params;

  const fabricante = await repository.findOneFabricante(id);
  
  fabricante.status = 2;
  
  await fabricante.save()
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Fabricante apagado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Fabricante não apagado com sucesso!",
      });
    });
};*/

module.exports = {AddTrocaOleo,
                  };