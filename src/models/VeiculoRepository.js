const { Op, Sequelize } = require("sequelize");
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
    include: [
      { model:Fabricante}, 
      { model: Modelo},         
    ],    
    
  })
};

function findAllTime(dateInicial, dateFinal) {

  return Veiculo.findAll({
    where: {
      status: '1'      
  },    
    include: [
      { model:Fabricante}, 
      { model: Modelo},
      {model: Abastecimeto, attributes: ['id', 'data_abastecimento', 'qtd_litro', 'valor_litro', 'odometro_km',
      ],   
          where: {"data_abastecimento": {[Op.between]: [dateInicial, dateFinal]}},
          required: false,                  
        },        
    ],    
    order: [['id', 'ASC'],[Abastecimeto, 'data_abastecimento', 'ASC'],],
  })
};

function findAllMntTime(dateInicial, dateFinal) {

  return Veiculo.findAll({
    where: {
      status: '1'      
  },    
    include: [
      { model:Fabricante}, 
      { model: Modelo},
      {model: Manutencao, attributes: ['id', 'data_mnt', 'desc_mnt', 'valor_mnt', 'servicoId'
      ],   
          where: {"data_mnt": {[Op.between]: [dateInicial, dateFinal]}},
          include: [Servico],
          required: false,                  
        },        
    ],    
    order: [['id', 'ASC'],[Manutencao, 'servicoId', 'ASC'],],
  })
};



function findAllold() {

  return Abastecimeto.findAll({
    attributes: [[Sequelize.fn('sum', Sequelize.col('qtd_litro')), 'total_Litro'], 
    [Sequelize.fn('sum', Sequelize.col('valor_litro')), 'total_valor_litro'],],
    where: {      
      data_abastecimento: {[Op.between]: ['2022-08-01', '2022-08-31']}     
  },    
    include: [{ model:Veiculo}],
    group : ['Veiculo.id'],
    raw: true,
    
  })
};

function findByIdMntOne(id,primeiroDia,ultimoDia) {

  return Veiculo.findByPk(id, {
    include: [ 
      {model:Fabricante}, 
      {model: Modelo}, 
      {model: Abastecimeto,  
        where: {"data_abastecimento": {[Op.between]: [primeiroDia, ultimoDia]}}, include: [Posto, Combustivel]
      }
      ],
      
      order: [[Abastecimeto, 'data_abastecimento', 'ASC']]  
  
  }); 

}

function findByIdMntTwo(id,primeiroDia,ultimoDia) {

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
      ],
      
      order: [[Abastecimeto, 'data_abastecimento', 'ASC'], [Manutencao, 'data_mnt', 'ASC']]  
  
  });  
}

  function findByIdMntThree(id,primeiroDia,ultimoDia) {

    return Veiculo.findByPk(id, {
      include: [ 
        {model:Fabricante}, 
        {model: Modelo}, 
        {model: Abastecimeto, attributes: ['id', 'data_abastecimento', 'qtd_litro', 'valor_litro', 'odometro_km'],   
          where: {"data_abastecimento": {[Op.between]: [primeiroDia, ultimoDia]}}, include: [Posto, Combustivel],
          required: false,
        },
        {model: Manutencao,  
          where: {"data_mnt": {[Op.between]: [primeiroDia, ultimoDia]}}, include: [Oficina, Servico],
          required: false
        },        
        {model: TrocaOleo,  
          where: {"data_troca": {[Op.between]: [primeiroDia, ultimoDia]}}, include: [Oficina, Oleo],
          required: false
        }
        ],                       
        order: [[Abastecimeto, 'data_abastecimento', 'ASC'], [Manutencao, 'data_mnt', 'ASC']],           
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
  return Veiculo.findOne({ include:[{model:Fabricante}, {model:Abastecimeto} ], where: {id: id}, order: [[Abastecimeto, 'odometro_km', 'ASC']], });
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

module.exports = {countVeiculo, findAll, findAllTime, findAllMntTime, findByIdMntOne, findByIdMntTwo, findByIdMntThree,findById1, findOneVeiculoId, findOneVeiculo, add,};