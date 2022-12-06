"use strict";
const { hashPass } = require("../helpers/bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seller.hasOne(models.Shop);
    }
  }
  Seller.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Username cannot be empty",
          },
          notNull: {
            msg: "Username cannot be empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Email is required",
          },
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            args: true,
            msg: "Invalid email format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password is required",
          },
          notNull: {
            msg: "Password is required",
          },
          validLength(password) {
            if (password.length < 5) {
              throw new Error("Minimum password length is 5 character");
            }
          },
        },
      },
      phoneNumber: DataTypes.STRING,
      ktp: DataTypes.STRING, 
    },
    {
      sequelize,
      modelName: "Seller",
    }
  );

  Seller.beforeCreate((seller, options) => {
    seller.password = hashPass(seller.password);
  });
  return Seller;
};
