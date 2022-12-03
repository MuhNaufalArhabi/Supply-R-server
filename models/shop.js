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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required'
        },
        notEmpty: {
          msg: 'Name is required'
        }
      }
    },
    lat: {
      type: DataTypes.STRING,
    },
    long: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Address is required'
        },
        notEmpty: {
          msg: 'Address is required'
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phone number is required'
        },
        notEmpty: {
          msg: 'Phone number is required'
        }
      }
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Owner is required'
        },
        notEmpty: {
          msg: 'Owner is required'
        }
      }
    },
    SellerId: {
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Shop',
  });
  return Shop;
};