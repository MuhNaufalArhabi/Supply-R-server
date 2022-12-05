const { Order, OrderProduct, sequelize, Product, Shop } = require("../models");
const midtransClient = require("midtrans-client");
class OrderController {
  static async fetchBuyerOrder(req, res, next) {
    try {
      const BuyerId = req.buyer.id;
      let options = {
        where: { BuyerId },
        include: {
          model: OrderProduct,
          include: {
            model: Product,
            include: {
              model: Shop,
            },
          },
        },
      };
      const orders = await Order.findAll(options);
      // if (!orders) {
      //   throw { name: "not_found" };
      // }
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
      if (!orderlists) {
        throw { name: "no_input" };
      }
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
      // if (!orderProduct) {
      //   throw { name: "not_found" };
      // }
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
      res.status(200).json({ msg: "orderproduct deleted" });
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
      //janlup tambahin proteksi tambahan kalau ispaid ternyata true
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
      if (!order) {
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
  static async midTransToken(req, res, next) {
    try { 
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });
      console.log(process.env.MIDTRANS_SERVER_KEY);
      const order_id = "TRANS_" + new Date().getTime();
      let parameter = {
        transaction_details: {
          order_id: order_id, // isi order_id dengan value yang unique untuk tiap transaction
          gross_amount: req.body.price, // harga total transaction (jika untuk keperluan bayar beberapa item maka tinggal di total harga2 nya)
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          // email: "budi@mail.com",
          // phone: "08111222333",
        },
      };

      const transaction = await snap.createTransaction(parameter);

      res.status(201).json({ transaction });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  // static async testGetOrder(req, res, next) {
  //   try {
  //     const data = await Shop.findAll({
  //       include: {
  //         model: Product,
  //         required: true,
  //         include: {
  //           model: OrderProduct,
  //           required: true,

  //           include: {
  //             model: Order,
  //             where: { isPaid: false },
  //           },
  //         },
  //       },
  //       where: {
  //         id: 4,
  //       },
  //     });
  //     res.status(200).json(data);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

module.exports = OrderController;
