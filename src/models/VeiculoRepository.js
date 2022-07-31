const { Op } = require("sequelize");
const Veiculo = require("./Veiculo");
const Modelo = require("./Modelo");
const Fabricante = require("./Fabricante");

function countVeiculo() { return Veiculo.count(); };

function findAll() {

  return Veiculo.findAll({
    where: {
      status: '1'      
  },    
    include: [{ model:Fabricante}, { model: Modelo}]
    
  })
};

function findById(id) {
  return Veiculo.findByPk(id, {include: [ {model:Fabricante}, {model: Modelo}] });
}

function findOneVeiculoId(id) {
  return Veiculo.findOne({ where: {id: id}});
}

function findOneVeiculo(placa) {
  return Veiculo.findOne({
    where: {
      placa: placa,
    },
  });
}

function add(veiculo) {
  return Veiculo.create(veiculo);
}

/*function set(modelo, id) {
  return Modelo.update(modelo, { where: { id } }); 
}

function remove(id) {
  return Modelo.destroy({ where: { id } });   
}*/

module.exports = {countVeiculo, findAll, findById, findOneVeiculoId, findOneVeiculo, add,};