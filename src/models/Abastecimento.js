const {Sequelize, DataTypes} = require("sequelize");
const db = require("./db");
const Veiculo = require("./Veiculo");
const Posto = require("./Posto");
const Combustivel = require("./Combustivel");

const Abastecimento = db.define('abastecimentos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  data_abastecimento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  qtd_litro: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valor_litro: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  odometro_km: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },  
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

Veiculo.hasOne(Abastecimento);
Abastecimento.belongsTo(Veiculo);

Posto.hasOne(Abastecimento);
Abastecimento.belongsTo(Posto);

Combustivel.hasOne(Abastecimento);
Abastecimento.belongsTo(Combustivel);

//Abastecimento.sync();
//Abastecimento.sync({ alter: true });

module.exports = Abastecimento;