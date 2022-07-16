const {Sequelize, DataTypes} = require("sequelize");
const db = require("./db");

const Modelo = db.define('modelos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome_modelo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fabricante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//Aula.belongsTo(Modulo);
//Modulo.hasOne(Curso);

//Modelo.sync();
//Modelo.sync({ alter: true });

module.exports = Modelo;