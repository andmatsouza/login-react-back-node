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
    
      odometro_km: yup.number().typeError('Digite a valor p odômetro Km').required().positive("O campo odômetro Km deve ser positivo."),      
      valor_litro: yup.number().typeError('Digite o valor do litro').required().positive("O campo valor do litro deve ser positivo."),
      qtd_litro: yup.number().typeError('O campo Qde Litros deve ser um número').required().positive('O campo qtd litros deve ser positivo').integer("O campo qtd litros deve ser um número inteiro."),
      combustiveiId: yup.number().typeError('Selecione o Combustível').required().positive("O campo combustível deve ser positivo.").integer("O campo combustível deve ser um número inteiro."),
      veiculoId: yup.number().typeError('Selecione um Veiculo').required("O campo veículo é obrigatório.").positive("O campo veículo deve ser positivo.").integer("O campo veículo deve ser um número inteiro."),
      postoId: yup.number().typeError('Selecione um Posto').required("O campo posto é obrigatório.").positive("O campo posto deve ser positivo.").integer("O campo posto deve ser um número inteiro."),
      data_abastecimento: yup.date().typeError('Digite uma Data Abastecimento válida').required(),   
   
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