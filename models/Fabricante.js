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
    }
});

Fabricante.hasMany(Modelo, {
  constraints: true,
  foreignKey: 'fabricante_id'
});

//Modulo.belongsTo(Curso);

//Fabricante.sync();
//Fabricante.sync({ alter: true });

module.exports = Fabricante;