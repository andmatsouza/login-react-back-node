const {Sequelize, DataTypes} = require('sequelize');
const db = require('./db');
//const Modelo = require('./Modelo');

const Servico = db.define('servicos', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_servico:{
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

//Servico.sync();
//Servico.sync({ alter: true });

module.exports = Servico;