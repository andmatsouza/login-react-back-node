const {Sequelize, DataTypes} = require("sequelize");
const db = require("./db");
const Fabricante = require("./Fabricante");
const Modelo = require("./Modelo");
const Abastecimento = require("./Abastecimento");
const Manutencao = require("./Manutencao");
const TrocaOleo = require("./TrocaOleo");

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
  fabricanteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modeloId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Fabricante.hasOne(Veiculo);
Veiculo.belongsTo(Fabricante);

Modelo.hasOne(Veiculo);
Veiculo.belongsTo(Modelo);

Veiculo.hasMany(Abastecimento, {
  constraints: true,
  foreignKey: 'veiculoId'
});

Abastecimento.belongsTo(Veiculo);

Veiculo.hasMany(Manutencao, {
  constraints: true,
  foreignKey: 'veiculoId'
});

Manutencao.belongsTo(Veiculo);

Veiculo.hasMany(TrocaOleo, {
  constraints: true,
  foreignKey: 'veiculoId'
});

TrocaOleo.belongsTo(Veiculo);



//Veiculo.sync();
//Veiculo.sync({ alter: true });

module.exports = Veiculo;