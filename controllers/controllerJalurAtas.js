const { comparePass } = require("../helpers/bcrypt");
const { encode } = require("../helpers/jwt");
const { Buyer, Order } = require("../models");

class ControllerJalurAtas {
  static async getBuyers(req, res, next) {
    try {
      const buyer = await Buyer.findAll({
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
        include: [Order],
      });
      if (!buyer) {
        throw { name: "NotFound" };
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
      const { id } = req.params;
      const deletedBuyer = await Buyer.destroy({
        where: { id },
      });
      res.status(200).json({ id: deletedBuyer.id, email: deletedBuyer.email });
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
        throw { name: "InvalidLogin" };
      }
      if (comparePass(password, buyerData.password)) {
        const payload = { id: buyerData.id };
        const token = encode(payload);
        res.status(200).json({
          access_token: token,
        });
      } else {
        throw { name: "InvalidLogin" };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerJalurAtas;
