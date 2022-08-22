const { Op } = require("sequelize");
const Veiculo = require("./Veiculo");
const Modelo = require("./Modelo");
const Fabricante = require("./Fabricante");
const Abastecimeto = require("./Abastecimento");
const Posto = require("./Posto");
const Combustivel = require("./Combustivel");
const Manutencao = require("./Manutencao");
const Oficina = require("./Oficina");
const Servico = require("./Servico");
const Oleo = require("./Oleo");
const TrocaOleo = require("./TrocaOleo");

function countVeiculo() { return Veiculo.count(); };

function findAll() {

  return Veiculo.findAll({
    where: {
      status: '1'      
  },    
    include: [{ model:Fabricante}, { model: Modelo}]
    
  })
};

/*function findById(id,primeiroDia,ultimoDia) {

  return Veiculo.findByPk(id, {
    include: [ 
      {model:Fabricante}, 
      {model: Modelo}, 
      {model: Abastecimeto,  
        where: {"data_abastecimento": {[Op.between]: [primeiroDia, ultimoDia]}}, include: [Posto, Combustivel]
      }
      ],
      
      order: [[Abastecimeto, 'data_abastecimento', 'ASC']]  
  
  }); */

  function findById(id,primeiroDia,ultimoDia) {

    return Veiculo.findByPk(id, {
      include: [ 
        {model:Fabricante}, 
        {model: Modelo}, 
        {model: Abastecimeto,  
          where: {"data_abastecimento": {[Op.between]: [primeiroDia, ultimoDia]}}, include: [Posto, Combustivel]
        },
        {model: Manutencao,  
          where: {"data_mnt": {[Op.between]: [primeiroDia, ultimoDia]}}, include: [Oficina, Servico]
        },        
        {model: TrocaOleo,  
          where: {"data_troca": {[Op.between]: [primeiroDia, ultimoDia]}}, include: [Oficina, Oleo]
        }
        ],
        
        order: [[Abastecimeto, 'data_abastecimento', 'ASC'], [Manutencao, 'data_mnt', 'ASC']]  
    
    }); 


  //return Veiculo.findByPk(id, {include: [ {model:Fabricante}, {model: Modelo}, {model: Abastecimeto, include: [Posto, Combustivel]}], order: [[Abastecimeto, 'data_abastecimento', 'DESC']]  });
  //return Veiculo.findByPk(id, {include: [ {model:Fabricante}, {model: Modelo}, {model: Abastecimeto}] });  
}

function findById1(id) {

  return Veiculo.findByPk(id, {include: [ {model:Fabricante}, {model: Modelo}, {model: Abastecimeto, include: [Posto, Combustivel]}, {model: Manutencao, include: [Oficina, Servico]}, {model: TrocaOleo, include: [Oficina, Oleo]}], order: [[Abastecimeto, 'data_abastecimento', 'ASC']]  });
  //return Veiculo.findByPk(id, {include: [ {model:Fabricante}, {model: Modelo}, {model: Abastecimeto, include: [Posto, Combustivel]}], order: [[Abastecimeto, 'data_abastecimento', 'ASC']]  });
  //return Veiculo.findByPk(id, {include: [ {model:Fabricante}, {model: Modelo}, {model: Abastecimeto}] });  
}



function findOneVeiculoId(id) {
  return Veiculo.findOne({ include:[{model:Fabricante}], where: {id: id}});
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

module.exports = {countVeiculo, findAll, findById,findById1, findOneVeiculoId, findOneVeiculo, add,};