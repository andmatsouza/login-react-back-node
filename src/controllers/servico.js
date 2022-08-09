const express = require("express");
const app = express();
const yup = require("yup");
require("dotenv").config();
//const fs = require('fs');
const path = require('path');
app.use('/files', express.static(path.resolve(__dirname,"public", "upload")));

const repository = require("../models/ServicoRepository");


async function AddServico(req, res) {
  var dados = req.body;

  const schema = yup.object().shape({   
    
    nome_servico: yup
      .string("Erro: Necessário preencher o campo nome do serviço!")
      .required("Erro: Necessário preencher o campo nome do serviço!"),
  });

  try {
    await schema.validate(dados);
  } catch (err) {
    return res.status(400).json({
      erro: true,
      mensagem: err.errors,
    });
  }  

  const servico = await repository.findOneServico(req.body.nome_servico);

  if (servico) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Serviço já está cadastrado!",
    });
  }  

  await repository.add(dados)
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Serviço cadastrado com sucesso!",
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Serviço não cadastrado com sucesso!",
      });
    });
};

async function getServicos(req, res) {
  const { page = 1 } = req.params;
  const limit = 7;
  let lastPage = 1;

  const countServico = await repository.countServico();
  if (countServico === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhuma serviço encontrado!",
    });
  } else {
    lastPage = Math.ceil(countServico / limit);
  }

  await repository.findAll(page)
    .then((servicos) => {
      return res.json({
        erro: false,
        servicos,
        countServico,
        lastPage,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum serviço encontrado!",
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

module.exports = {AddServico,
                  getServicos
                  };