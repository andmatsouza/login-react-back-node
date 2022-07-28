const {Sequelize, DataTypes} = require('sequelize');
const db = require('./db');
const Modelo = require('./Modelo');

const Fabricante = db.define('fabricantes', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_fabricante:{
        type: DataTypes.STRING,
        allowNull: false,
    },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1 
  }
});

Fabricante.hasMany(Modelo, {
  constraints: true,
  foreignKey: 'fabricanteId'
});

Modelo.belongsTo(Fabricante);

//Fabricante.sync();
//Fabricante.sync({ alter: true });

module.exports = Fabricante;