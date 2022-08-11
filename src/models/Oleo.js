const {Sequelize, DataTypes} = require('sequelize');
const db = require('./db');

const Oleo = db.define('oleos', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_oleo:{
        type: DataTypes.STRING,
        allowNull: false,
    },    
  km_oleo: {
    type: DataTypes.INTEGER,
    allowNull: true,   
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

//Oleo.sync();
//Oleo.sync({ alter: true });

module.exports = Oleo;