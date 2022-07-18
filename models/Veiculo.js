const {Sequelize, DataTypes} = require("sequelize");
const db = require("./db");
const Fabricante = require("./Fabricante");
const Modelo = require("./Modelo");

const Veiculo = db.define('veiculos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  renavam: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  
  ano_fabricacao: {
        type: DataTypes.DATE,
        allowNull: false
    },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fabricante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modelo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//Aula.belongsTo(Modulo);
//Veiculo.hasOne(Fabricante);
//Veiculo.hasOne(Modelo);

//Veiculo.sync();
//Veiculo.sync({ alter: true });

module.exports = Veiculo;