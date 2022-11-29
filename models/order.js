'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Buyer)
      Order.hasMany(models.OrderProduct)
    }
  }
  Order.init({
    isPaid: DataTypes.BOOLEAN,
    paymentMethod: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER,
    BuyerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};