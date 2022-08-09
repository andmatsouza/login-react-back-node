const { Op } = require("sequelize");
const Servico = require("./Servico");

function countServico() { return Servico.count(); };

function findAll(pages) {
  const { page = 1 } = pages;
  const limit = 7;  

  return Servico.findAll({
    where: {
      status: '1'      
  },
    attributes: ["id", "nome_servico"],
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

function findOneServico(nomeServico) {
  return Servico.findOne({
    attributes: ["nome_servico"],
    where: {
      nome_servico: nomeServico,
    },
  });
}


function add(servico) {
  return Servico.create(servico);
}

/*function set(fabricante, id) {
  return Fabricante.update(fabricante, { where: { id } });  
}

function remove(id) {
  return Fabricante.destroy({ where: { id } });
   
}*/



module.exports = {countServico, findAll, findOneServico, add};