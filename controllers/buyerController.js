const { comparePass } = require("../helpers/bcrypt");
const { encode } = require("../helpers/jwt");
const { Buyer, Order, OrderProduct, sequelize } = require("../models");

class BuyerController {
  static async getBuyers(req, res, next) {
    try {
      const buyer = await Buyer.findAll({
        attributes: [
          "id",
          "name",
          "owner",
          "email",
          "phoneNumber",
          "address",
          "website",
          "industry",
        ],
        include: [Order],
      });
      res.status(200).json(buyer);
    } catch (error) {
      next(error);
    }
  }
  static async getOneBuyer(req, res, next) {
    try {
      const { id } = req.params;
      const buyer = await Buyer.findOne({
        where: { id },
        attributes: [
          "id",
          "name",
          "owner",
          "email",
          "phoneNumber",
          "address",
          "website",
          "industry",
        ],
        include: [Order],
      });
      if (!buyer) {
        throw { name: "not_found" };
      }
      res.status(200).json(buyer);
    } catch (error) {
      next(error);
    }
  }
  static async postBuyer(req, res, next) {
    try {
      const {
        name,
        owner,
        password,
        email,
        phoneNumber,
        address,
        industry,
        website,
      } = req.body;
      const newBuyer = await Buyer.create({
        name,
        owner,
        password,
        email,
        phoneNumber,
        address,
        industry,
        website,
      });
      res.status(201).json({ id: newBuyer.id, email: newBuyer.email });
    } catch (error) {
      next(error);
    }
  }
  static async delBuyer(req, res, next) {
    try {
      const { id } = req.buyer;
      await Buyer.destroy({
        where: { id },
      });
      res.status(200).json({ msg: "Buyer deleted" });
    } catch (error) {
      next(error);
    }
  }
  static async buyerLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const buyerData = await Buyer.findOne({
        where: { email },
      });
      if (!buyerData) {
        throw { name: "invalidLogin" };
      }
      if (comparePass(password, buyerData.password)) {
        const payload = { id: buyerData.id };
        const token = encode(payload);
        res.status(200).json({
          access_token: token,
          role: 'buyer',
          name: buyerData.name,
          id: buyerData.id,
        });
      } else {
        throw { name: "invalidLogin" };
      }
    } catch (error) {
      next(error);
    }
  }
  static async editBuyer(req, res, next) {
    try {
      const {
        name,
        owner,
        email,
        phoneNumber,
        address,
        website,
        industry,
      } = req.body;
      const { id: buyerId } = req.buyer;
      const buyer = await Buyer.findOne({ where: { id: buyerId } });
      if (!buyer) {
        throw { name: "not_found" };
      }
      buyer.set({
        name,
        owner,
        email,
        phoneNumber,
        address,
        website,
        industry,
      });
      await buyer.save();
      res
        .status(200)
        .json({ msg: `buyer id ${buyer.id} is successfully changed` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BuyerController;
