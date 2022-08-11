const express = require("express");
const app = express();
const yup = require("yup");
require("dotenv").config();
//const fs = require('fs');
const path = require('path');
app.use('/files', express.static(path.resolve(__dirname,"public", "upload")));

const repository = require("../models/OleoRepository");


async function AddOleo(req, res) {
  var dados = req.body;

  const schema = yup.object().shape({   
    
    nome_oleo: yup
      .string("Erro: Necessário preencher o campo nome da oficina!")
      .required("Erro: Necessário preencher o campo nome da oficina!"),
    km_oleo: yup.number().typeError('O campo Km óleo deve ser um número').required().positive('O campo km óleo deve ser positivo').integer("O campo km óleo deve ser um número inteiro."),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  const oleo = await repository.findOneOleo(req.body.nome_oleo);

  if (oleo) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Óleo já está cadastrado!",
    });
  }  

  await repository.add(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Óleo cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Óleo não cadastrado com sucesso!",
      });
    });
};

async function getOleos(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countOleo = await repository.countOleo();
  if (countOleo === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum óleo encontrado!",
    });
  } else {
    lastPage = Math.ceil(countOleo / limit);
  }

  await repository.findAll(page)
    .then((oleos) => {
      return res.json({
        erro: false,
        oleos,
        countOleo,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum óleo encontrado!",
      });
    });
};

/*async function getFabricante(req, res) {
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

module.exports = {AddOleo,
                  getOleos
                  };