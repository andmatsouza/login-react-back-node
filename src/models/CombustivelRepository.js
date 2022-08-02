const { Op } = require("sequelize");
const Combustivel = require("./Combustivel");
//const Modelo = require("./Modelo");

function countCombustivel() { return Combustivel.count(); };

function findAll() {  

  return Combustivel.findAll({
    where: {
      status: '1'      
  },
    attributes: ["id", "nome_combustivel"],
    order: [["id", "DESC"]],    
  }) 
};

/*function findById(id) {
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
}*/

function findOneCombustivel(id) {
  return Combustivel.findOne({ where: {id: id}});
}


function add(combustivel) {
  return Combustivel.create(combustivel);
}

/*function set(fabricante, id) {
  return Fabricante.update(fabricante, { where: { id } });  
}

function remove(id) {
  return Fabricante.destroy({ where: { id } });
   
}*/



module.exports = {countCombustivel, findOneCombustivel, findAll, add};