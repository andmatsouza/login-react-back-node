const { Op } = require("sequelize");
const Oleo = require("./Oleo");

function countOleo() { return Oleo.count(); };

function findAll(pages) {
  const { page = 1 } = pages;
  const limit = 7;  

  return Oleo.findAll({
    where: {
      status: '1'      
  },
    attributes: ["id", "nome_oleo", "km_oleo"],
    order: [["id", "DESC"]],
    offset: Number(page * limit - limit),
    limit: limit,
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

function findOneOleo(nomeOleo) {
  return Oleo.findOne({
    attributes: ["nome_oleo"],
    where: {
      nome_oleo: nomeOleo,
    },
  });
}


function add(oleo) {
  return Oleo.create(oleo);
}

/*function set(fabricante, id) {
  return Fabricante.update(fabricante, { where: { id } });  
}

function remove(id) {
  return Fabricante.destroy({ where: { id } });
   
}*/



module.exports = {countOleo, findAll, findOneOleo, add};