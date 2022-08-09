const {Sequelize, DataTypes} = require("sequelize");
const db = require("./db");
const Servico = require("./Servico");
const Oficina = require("./Oficina");

const Manutencao = db.define('manutencoes', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  data_mnt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  desc_mnt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor_mnt: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },    
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  veiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Servico.hasOne(Manutencao);
Manutencao.belongsTo(Servico);

Oficina.hasOne(Manutencao);
Manutencao.belongsTo(Oficina);

//Manutencao.sync();
//Manutencao.sync({ alter: true });

module.exports = Manutencao;