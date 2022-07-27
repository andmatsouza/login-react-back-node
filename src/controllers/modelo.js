const express = require("express");
const app = express();
const yup = require("yup");
require("dotenv").config();
//const fs = require('fs');
const path = require('path');
app.use('/files', express.static(path.resolve(__dirname,"public", "upload")));

const repository = require("../models/ModeloRepository");


async function AddModelo(req, res) {
  var dados = req.body;

  const schema = yup.object().shape({   
    
    nome_modelo: yup
      .string("Erro: Necessário preencher o campo nome do modelo!")
      .required("Erro: Necessário preencher o campo nome do modelo!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  const modelo = await repository.findOneModelo(req.body.nome_modelo);

  if (modelo) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este modelo já está cadastrado!",
    });
  }  

  await repository.add(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Modelo cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Modelo não cadastrado com sucesso!",
      });
    });
};

async function getModelos(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countModelo = await repository.countModelo();
  if (countModelo === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum modelo encontrado!",
    });
  } else {
    lastPage = Math.ceil(countModelo / limit);
  }

  await repository.findAll()
    .then((modelos) => {
      return res.json({
        erro: false,
        modelos,
        countModelo,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum modelo encontrado!",
      });
    });
};

async function getModelo(req, res) {
  const { id } = req.params;

  await repository.findById(id)
    .then((modelo) => {       
      return res.json({
        erro: false,
        modelo: modelo        
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum modelo encontrado!",
      });
    });
};


async function setModelo(req, res) {
  const { id } = req.body;
  const dados = req.body;

  const schema = yup.object().shape({   
    nome_modelo: yup
      .string("Erro: Necessário preencher o campo nome do modelo!")
      .required("Erro: Necessário preencher o campo nome do modelo!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  } 

  const modelo = await repository.findOneModeloId(req.body.nome_modelo, id);

  if (modelo) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este modelo já está cadastrado!",
    });
  }

  await repository.set(dados, id)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Modelo editado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Modelo não editado com sucesso!",
      });
    });
};


async function deleteModelo(req, res) {
  const { id } = req.params;

  await repository.remove(id)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Modelo apagado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Modelo não apagado com sucesso!",
      });
    });
};

module.exports = {AddModelo,
                  getModelos,
                  getModelo,
                  setModelo,
                  deleteModelo,
                  };