const { Op } = require("sequelize");
const Fabricante = require("./Fabricante");
const Modelo = require("./Modelo");

function countModelo() { return Modelo.count(); };

function findAll() {

  return Modelo.findAll({
    
    include: Fabricante
  })
};

function findById(id) {
  return Modelo.findByPk(id, {include: [{model: Fabricante}] });
}

function findOneModeloId(nome_modelo, id) {
  return Modelo.findOne({
    where: {
      nome_modelo: nome_modelo,
      id: {
        [Op.ne]: id,
      },
    },
  });
}

function findOneModelo(nome_modelo) {
  return Modelo.findOne({
    where: {
      nome_modelo: nome_modelo,
    },
  });
}

function add(modelo) {
  return Modelo.create(modelo);
}

function set(modelo, id) {
  return Modelo.update(modelo, { where: { id } }); 
}

function remove(id) {
  return Modelo.destroy({ where: { id } });   
}

module.exports = {countModelo, findAll, findById, findOneModeloId, findOneModelo, add, set, remove};