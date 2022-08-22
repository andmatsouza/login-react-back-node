const {Sequelize, DataTypes} = require("sequelize");
const db = require("./db");
//const Veiculo = require("./Veiculo");
const Oficina = require("./Oficina");
const Oleo = require("./Oleo");

const TrocaOleo = db.define('trocaoleos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  data_troca: {
    type: DataTypes.DATE,
    allowNull: false
  },  
  filtro_oleo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  filtro_combustivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }, 
  valor_troca: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  odometro_atual: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  odometro_troca: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  obs: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  veiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Oficina.hasOne(TrocaOleo);
TrocaOleo.belongsTo(Oficina);

Oleo.hasOne(TrocaOleo);
TrocaOleo.belongsTo(Oleo);

//Veiculo.hasOne(Abastecimento);
//Abastecimento.belongsTo(Veiculo);

//TrocaOleo.sync();
//TrocaOleo.sync({ alter: true });

module.exports = TrocaOleo;