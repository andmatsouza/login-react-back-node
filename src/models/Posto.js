const {Sequelize, DataTypes} = require('sequelize');
const db = require('./db');
//const Modelo = require('./Modelo');

const Posto = db.define('postos', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_posto:{
        type: DataTypes.STRING,
        allowNull: false,
    },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

/*Fabricante.hasMany(Modelo, {
  constraints: true,
  foreignKey: 'fabricanteId'
});
Modelo.belongsTo(Fabricante);*/

//Posto.sync();
//Posto.sync({ alter: true });

module.exports = Posto;