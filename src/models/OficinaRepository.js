const { Op } = require("sequelize");
const Oficina = require("./Oficina");

function countOficina() { return Oficina.count(); };

function findAll(pages) {
  const { page = 1 } = pages;
  const limit = 7;  

  return Oficina.findAll({
    where: {
      status: '1'      
  },
    attributes: ["id", "nome_oficina"],
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

function findOneOficina(nomeOficina) {
  return Oficina.findOne({
    attributes: ["nome_oficina"],
    where: {
      nome_oficina: nomeOficina,
    },
  });
}


function add(oficina) {
  return Oficina.create(oficina);
}

/*function set(fabricante, id) {
  return Fabricante.update(fabricante, { where: { id } });  
}

function remove(id) {
  return Fabricante.destroy({ where: { id } });
   
}*/



module.exports = {countOficina, findAll, findOneOficina, add};