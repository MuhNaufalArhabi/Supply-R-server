const { Seller } = require("../models");
const { comparePass } = require("../helpers/bcrypt");
const { encode } = require("../helpers/jwt");

class SellerController {
  static async findAll(req, res, next) {
    try {
      const sellers = await Seller.findAll();
      res.status(200).json(sellers);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { username, email, password, phoneNumber, ktp } = req.body;
      const seller = await Seller.create({
        username,
        email,
        password,
        phoneNumber,
        ktp,
      });
      res.status(201).json({ id: seller.id, email: seller.email });
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const seller = await Seller.findOne({
        where: {
          id,
        },
      });
      res.status(200).json(seller);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, password, phoneNumber, ktp } = req.body;
      const seller = await Seller.update(
        {
          username,
          email,
          password,
          phoneNumber,
          ktp,
        },
        {
          where: {
            id,
          },
          returning: true,
        }
      );
      res.status(200).json(seller);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const seller = await Seller.destroy({
        where: {
          id,
        },
      });
      res.status(200).json(seller);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const seller = await Seller.findOne({
        where: {
          email,
        },
      });
      if (!seller) {
        throw { name: "invalid_email" };
      } else if (!comparePass(password, seller.password)) {
        throw { name: "invalid_password" };
      } else {
        const access_token = encode({
          id: seller.id,
          email: seller.email,
        });
        res.status(200).json({ access_token });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SellerController;
