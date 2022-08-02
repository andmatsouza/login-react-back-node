const express = require("express");
const app = express();
const yup = require("yup");
require("dotenv").config();
//const fs = require('fs');
const path = require('path');
app.use('/files', express.static(path.resolve(__dirname,"public", "upload")));

const repository = require("../models/AbastecimentoRepository");


async function AddAbastecimento(req, res) {
  var dados = req.body;

  const schema = yup.object().shape({   
    
    data_abastecimento: yup
      .string("Erro: Necessário preencher o campo nome do combustível!")
      .required("Erro: Necessário preencher o campo nome do combustível!"),
    qtd_litro: yup
      .string("Erro: Necessário preencher o campo litro!")
      .required("Erro: Necessário preencher o campo litro!"),
    valor_litro: yup
      .string("Erro: Necessário preencher o campo preço do litro!")
      .required("Erro: Necessário preencher o campo preço do litro!"),
    odometro_km: yup
      .string("Erro: Necessário preencher o campo Km!")
      .required("Erro: Necessário preencher o campo Km!"),
    veiculoId: yup
      .string("Erro: Necessário preencher o campo veículo!")
      .required("Erro: Necessário preencher o campo veículo!"),
    postoId: yup
      .string("Erro: Necessário preencher o campo posto!")
      .required("Erro: Necessário preencher o campo posto!"),
    combustiveiId: yup
      .string("Erro: Necessário preencher o campo combustível2!")
      .required("Erro: Necessário preencher o campo combustível2!"),
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
        mensagem: "Abastecimento cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Abastecimento não cadastrado com sucesso!",
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

module.exports = {AddAbastecimento,
                  };