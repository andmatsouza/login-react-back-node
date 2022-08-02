const { Op } = require("sequelize");
const Veiculo = require("./Veiculo");
const Modelo = require("./Modelo");
const Fabricante = require("./Fabricante");
const Abastecimeto = require("./Abastecimento");
const Posto = require("./Posto");
const Combustivel = require("./Combustivel");

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
  return Veiculo.findByPk(id, {include: [ {model:Fabricante}, {model: Modelo}, {model: Abastecimeto, include: [Posto, Combustivel]}], order: [[Abastecimeto, 'data_abastecimento', 'DESC']]  }); 
  //return Veiculo.findByPk(id, {include: [ {model:Fabricante}, {model: Modelo}, {model: Abastecimeto}] });  
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