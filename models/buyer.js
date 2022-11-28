'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Buyer.hasOne(models.Order)
      Buyer.hasMany(models.Chat)
    }
  }
  Buyer.init({
    name: DataTypes.STRING,
    owner: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    industry: DataTypes.STRING,
    website: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Buyer',
  });
  return Buyer;
};