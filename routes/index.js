const router = require("express").Router();
const sellerRouter = require("./sellerRouter");
const shopRouter = require("./shopRouter");
const buyerRoute = require("./buyerRoute");
const productRouter = require("./productRouter");
const orderRoute = require("./orderRoute");
const categoryRouter = require('./categoryRouter');
const {Order, OrderProduct, Product, Shop} = require('../models');

router.use("/shops", shopRouter);
router.use("/sellers", sellerRouter);
router.use("/buyers", buyerRoute);
router.use("/products", productRouter);
router.use("/orders", orderRoute);
router.use(categoryRouter);

router.get('/tester', async (req, res, next)=> {
  try {
    const paid = await Order.findAll({
      where: {
        isPaid: true
      }
    })
    
    const data = await Shop.findAll({
      include: {
        model: Product,
        include: {
          model: OrderProduct,
          where: {"Order.isPaid":true},
          include: {
            model: Order,
            // where: {isPaid: false}
          }
        }
      },
      where: {
        id: 1
      }
    })
    res.status(200).json(data)
    console.log(data)
  } catch (err) {
    next(err)
  }
})
module.exports = router;
