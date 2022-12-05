
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Shop)
      Product.belongsTo(models.Category)
      Product.hasMany(models.Image)
      Product.hasMany(models.OrderProduct)
    }
  }
  Product.init({
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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price is required'
        }, 
        notEmpty: {
          msg: 'Price is required'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required'
        }, 
        notEmpty: {
          msg: 'Description is required'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Stock is required'
        }, 
        notEmpty: {
          msg: 'Stock is required'
        }
      }
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Image is required'
        }, 
        notEmpty: {
          msg: 'Image is required'
        }
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ShopId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Category is required'
        }, 
        notEmpty: {
          msg: 'Category is required'
        }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};