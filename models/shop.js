'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shop.belongsTo(models.Seller)
      Shop.hasMany(models.Chat)
      Shop.hasMany(models.Product)
    }
  }
  Shop.init({
    name: DataTypes.STRING,
    lat: DataTypes.STRING,
    long: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    owner: DataTypes.STRING,
    SellerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Shop',
  });
  return Shop;
};