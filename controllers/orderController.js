const {
  Order,
  OrderProduct,
  sequelize,
  Product,
  Shop,
  Buyer,
  Category,
} = require("../models");
const midtransClient = require("midtrans-client");
class OrderController {
  static async fetchBuyerOrder(req, res, next) {
    try {
      const BuyerId = req.buyer.id;
      let options = {
        where: { BuyerId, isPaid: false, paymentMethod: "pending" },
        include: {
          model: OrderProduct,
          required: true,
          include: {
            model: Product,
            include: [Shop, Category],
          },
        },
      };
      const orders = await Order.findAll(options);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
  static async fetchBuyerOrderHistory(req, res, next) {
    try {
      const BuyerId = req.buyer.id;
      let { paymentMethod } = req.query;
      let options = {
        where: { BuyerId, isPaid: true },
        include: {
          model: OrderProduct,
          required: true,
          include: {
            model: Product,
            include: [Shop, Category],
          },
        },
      };
      if(paymentMethod){
        options.where.paymentMethod = paymentMethod;
      }
      const orders = await Order.findAll(options);
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
        where: { BuyerId, paymentMethod: "pending", isPaid: false },
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
      order.set(input);
      await order.save();
      res.status(200).json({ msg: "order changed" });
    } catch (error) {
      next(error);
    }
  }
  static async patchOrderMidtrans(req, res, next) {
    try {
      const { order_id, status_code, installment_term, payment_type } =
        req.body;
      console.log(req.body, typeof req.body);
      const OrderId = +order_id.split("-")[0];
      const order = await Order.findOne({
        where: { id: OrderId },
      });
      if (!order) {
        throw { name: "not_found" };
      }
      if (status_code == 200) {
        order.set({ isPaid: true });
        if (payment_type === "credit_card" && installment_term) {
          order.set({ paymentMethod: "installment" });
        } else {
          order.set({ paymentMethod: "upfront" });
        }
      }
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
        where: { BuyerId, paymentMethod: "pending", isPaid: false },
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
      res.status(201).json({ msg: `orderproducts created`, id: orders.id });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  
  static async delOrderProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      console.log("masuk sini <<<<<<<<<<<");
      const { orderProductId } = req.params;

      const orderProduct = await OrderProduct.findOne({
        where: { id: orderProductId },
      });

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
  static async bulkUpdateOrderProducts(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { orders } = req.body;
      const { OrderProducts } = orders;
      const BuyerId = req.buyer.id;
      //kalkulasi OrderProducts totalPrice mestinya di Backend
      const orderproducts = await OrderProduct.bulkCreate(OrderProducts, {
        // fields: ["quantity", "totalPrice", "ProductId", "OrderId"],
        returning: true,
        updateOnDuplicate: ["id", "quantity", "totalPrice", "ProductId"],
        transaction: t,
      });
      const order = await Order.findOne({
        where: { BuyerId, paymentMethod: "pending" },
        include: Buyer,
      });
      //kalkulasi Order totalPrice mestinya di Backend
      order.set({
        totalPrice: orders.totalPrice,
      });
      await order.save({ transaction: t });
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });
      let parameter = {
        transaction_details: {

          order_id: order.id + new Date().getTime(),

          gross_amount: order.totalPrice, 
        },
        credit_card: {
          secure: true,
          installment: {
            required: false,
            terms: {
              bca: [3, 6, 12],
              bni: [3, 6, 12],
              mandiri: [3, 6, 12],
              cimb: [3, 6, 12],
              bri: [3, 6, 12],
              maybank: [3, 6, 12],
              mega: [3, 6, 12],
            },
          },
        },
        customer_details: {
          first_name: order.Buyer.name,
        },
      };

      const transaction = await snap.createTransaction(parameter);

      await t.commit();

      res.status(201).json({ transaction });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = OrderController;
