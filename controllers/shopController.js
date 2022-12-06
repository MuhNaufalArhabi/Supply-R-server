const { Shop, Seller, Product } = require("../models");

class ShopController {
  static async findAll(req, res, next) {
    try {
      const shops = await Shop.findAll({
        include: [Seller],
      });
      res.status(200).json(shops);
    } catch (err) {
      next(err);
    }
  }

  static async findOne(req, res, next) {
    try {
      const shop = await Shop.findOne({
        where: {
          id: req.params.id,
        },
        include: [Seller, Product],
      });
      if (!shop) throw { name: "not_found" };

      res.status(200).json(shop);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const shop = await Shop.create({
        name: req.body.name,
        lat: req.body.lat,
        long: req.body.long,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        owner: req.body.owner,
        SellerId: req.user.id,
      });
      res.status(201).json(shop);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const shop = await Shop.findByPk(req.params.id);
      if (!shop) throw { name: "not_found" };
      await Shop.update(
        {
          name: req.body.name,
          lat: req.body.lat,
          long: req.body.long,
          address: req.body.address,
          phoneNumber: req.body.phoneNumber,
          owner: req.body.owner,
          SellerId: req.body.SellerId,
        },
        {
          where: {
            id: req.params.id,
          },
          returning: true,
        }
      );
      res.status(200).json({ message: "Shop updated" });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const shop = await Shop.findByPk(req.params.id);
      if (!shop) throw { name: "not_found" };
      await Shop.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ message: "Shop deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async findOrders(req, res, next) {
    try {
    
    } catch (err) {

      next(err);
    }
  }
}

module.exports = ShopController;
