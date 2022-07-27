const { Op } = require("sequelize");
const Fabricante = require("./Fabricante");
const Modelo = require("../models/Modelo");

function countFabricante() { return Fabricante.count(); };

function findAll(pages) {
  const { page = 1 } = pages;
  const limit = 7;  

  return Fabricante.findAll({
    where: {
      status: '1'      
  },
    attributes: ["id", "nome_fabricante"],
    order: [["id", "DESC"]],
    offset: Number(page * limit - limit),
    limit: limit,
  }) 
};

function findById(id) {
  return Fabricante.findByPk(id, {include: [{model: Modelo}] });
}

function findOneFabricanteId(nome_fabricante, id) {
  return Fabricante.findOne({
    where: {
      nome_fabricante: nome_fabricante,
      id: {
        [Op.ne]: id,
      },
    },
  });
}

function findOneFabricante(id) {
  return Fabricante.findOne({ where: {id: id}});
}


function add(fabricante) {
  return Fabricante.create(fabricante);
}

function set(fabricante, id) {
  return Fabricante.update(fabricante, { where: { id } });  
}

function remove(id) {
  return Fabricante.destroy({ where: { id } });
   
}



module.exports = {countFabricante, findAll, findById, findOneFabricanteId, findOneFabricante, add, set, remove};