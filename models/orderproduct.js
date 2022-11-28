'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderProduct.belongsTo(models.Order)
      OrderProduct.belongsTo(models.Product)
    }
  }
  OrderProduct.init({
    quantity: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    OrderId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderProduct',
  });
  return OrderProduct;
};