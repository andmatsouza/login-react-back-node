const {Sequelize, DataTypes} = require('sequelize');
const db = require('./db');
//const Modelo = require('./Modelo');

const Combustivel = db.define('combustiveis', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_combustivel:{
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

//Combustivel.sync();
//Combustivel.sync({ alter: true });

module.exports = Combustivel;