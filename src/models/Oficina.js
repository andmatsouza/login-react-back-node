const {Sequelize, DataTypes} = require('sequelize');
const db = require('./db');
//const Modelo = require('./Modelo');

const Oficina = db.define('oficinas', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_oficina:{
        type: DataTypes.STRING,
        allowNull: false,
    },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  }
});

/*Fabricante.hasMany(Modelo, {
  constraints: true,
  foreignKey: 'fabricanteId'
});
Modelo.belongsTo(Fabricante);*/

//Oficina.sync();
//Oficina.sync({ alter: true });

module.exports = Oficina;