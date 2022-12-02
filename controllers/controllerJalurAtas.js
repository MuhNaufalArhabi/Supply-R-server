const { comparePass } = require("../helpers/bcrypt");
const { encode } = require("../helpers/jwt");
const { Buyer, Order, OrderProduct, sequelize } = require("../models");

class ControllerJalurAtas {
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
      const deletedBuyer = await Buyer.destroy({
        where: { id },
      });
      res.status(200).json({ msg:"Buyer deleted" });
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
        password,
        phoneNumber,
        address,
        website,
        industry,
      } = req.body;
      const {id:buyerId} = req.buyer;
      const buyer = await Buyer.findOne({ where: { id: buyerId } });
      if (!buyer) {
        throw { name: "not_found" };
      }
      buyer.set({
        name,
        owner,
        email,
        password,
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
  static async fetchBuyerOrder(req, res, next) {
    try {
      const BuyerId = req.buyer.id;
      let options = {
        where: { BuyerId },
        include: [{ model: OrderProduct }],
      };
      const orders = await Order.findAll(options);
      if (!orders) {
        throw { name: "not_found" };
      }
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
  static async patchOrder(req, res, next) {
    try {
      const BuyerId = req.buyer.id;
      const { paymentMethod: p, isPaid: pay } = req.body;
      const order = await Order.findOne({
        where: { BuyerId, paymentMethod: "pending" },
      });
      if (!order) {
        throw { name: "not_found" };
      }
      const input = {
        paymentMethod: p ? p : null,
        isPaid: pay ? pay : null,
      };
      for (const key in input) {
        if (!input[key]) {
          delete input[key];
        }
      }
      console.log({ p, pay });
      order.set(input);
      await order.save();
      res.status(200).json({ msg: "order changed" });
    } catch (error) {
      next(error);
    }
  }
  static async postOrderProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const BuyerId = req.buyer.id;
      const [orders, created] = await Order.findOrCreate({
        where: { BuyerId, paymentMethod: "pending" },
        defaults: {
          BuyerId,
          isPaid: false,
          paymentMethod: "pending",
          totalPrice: 0,
        },
        transaction: t,
      });
      const { orderlists } = req.body;
      orderlists.map((el) => {
        el.OrderId = orders.id;
        return el;
      });
      await OrderProduct.bulkCreate(orderlists, { transaction: t });
      let sum = orders.totalPrice;
      orderlists.forEach((el) => {
        sum += el.totalPrice;
      });
      orders.set({ totalPrice: sum });
      await orders.save({ transaction: t });
      await t.commit();
      res.status(201).json({ msg: "orderproducts created" });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async delOrderProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { orderProductId } = req.params;
      const orderProduct = await OrderProduct.findOne({
        where: { id: orderProductId },
      });
      if (!orderProduct) {
        throw { name: "not_found" };
      }
      await OrderProduct.destroy({
        where: { id: orderProductId },
        transaction: t,
      });
      const order = await Order.findOne({
        where: { BuyerId: req.buyer.id, paymentMethod: "pending" },
      });
      await order.set({
        totalPrice: order.totalPrice - orderProduct.totalPrice,
      });
      await order.save({ transaction: t });
      await t.commit();
      res.status(200).json({ msg: "deleted" });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async patchOrderProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { orderProductId } = req.params;
      const { quantity, totalPrice } = req.body;
      const orderProduct = await OrderProduct.findOne({
        where: { id: orderProductId },
      });
      if (!orderProduct) {
        throw { name: "not_found" };
      }
      const initPrice = orderProduct.totalPrice;
      orderProduct.set({ quantity, totalPrice });
      await orderProduct.save({ transaction: t });
      const diffPrice = initPrice - totalPrice;
      const BuyerId = +req.buyer.id;
      const order = await Order.findOne({
        where: { BuyerId, paymentMethod: "pending" },
      });
      if(!order){
        throw { name: "not_found" };
      }
      await order.set({
        totalPrice: order.totalPrice - diffPrice,
      });
      await order.save({ transaction: t });
      await t.commit();
      res.status(200).json({ msg: "orderproduct changed" });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = ControllerJalurAtas;
