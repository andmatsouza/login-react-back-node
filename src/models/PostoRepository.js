const { Op } = require("sequelize");
const Posto = require("./Posto");
//const Modelo = require("./Modelo");

function countPosto() { return Posto.count(); };

/*function findAll(pages) {
  const { page = 1 } = pages;
  const limit = 7;  

  return Posto.findAll({
    where: {
      status: '1'      
  },
    attributes: ["id", "nome_posto"],
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
}*/

function findOnePosto(id) {
  return Posto.findOne({ where: {id: id}});
}


function add(posto) {
  return Posto.create(posto);
}

/*function set(fabricante, id) {
  return Fabricante.update(fabricante, { where: { id } });  
}

function remove(id) {
  return Fabricante.destroy({ where: { id } });
   
}*/



module.exports = {countPosto, findOnePosto, add};