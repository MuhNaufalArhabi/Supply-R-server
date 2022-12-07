const router = require("express").Router();
const sellerRouter = require("./sellerRouter");
const shopRouter = require("./shopRouter");
const buyerRoute = require("./buyerRoute");
const productRouter = require("./productRouter");
const orderRoute = require("./orderRoute");
const categoryRouter = require('./categoryRouter');
const roomRouter = require('./roomRouter');
const {Order, Shop, Product, OrderProduct} =  require('../models'); 



router.use("/shops", shopRouter);
router.use("/sellers", sellerRouter);
router.use("/buyers", buyerRoute);
router.use("/products", productRouter);
router.use("/orders", orderRoute);
router.use("/rooms", roomRouter);
router.use(categoryRouter);

// router.get('/matriks-upfront/:id', async(req, res, next) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findAll({
//       include: {
//         model: OrderProduct,
//         include: {
//           model: Product,
//           where: {
//             ShopId: id
//           },
//           include: {
//             model: Shop,
//           }
//         }
//       },
//       where: {
//         isPaid: true,
//         paymentMethod: 'upfront'
//       }
//     })
//     res.status(200).json(order)
//   } catch (err) {
//     next(err)
//   }
// })

// router.get('/matriks-installment/:id', async(req, res, next) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findAll({
//       include: {
//         model: OrderProduct,
//         include: {
//           model: Product,
//           where: {
//             ShopId: id
//           },
//           include: {
//             model: Shop,
//           }
//         }
//       },
//       where: {
//         isPaid: true,
//         paymentMethod: 'installment'
//       }
//     })
//     res.status(200).json(order)
//   } catch (err) {
//     next(err)
//   }
// })

router.get('/matriks-test/:id', async(req, res, next)=> {
  try {
    const { id } = req.params
    const shop = await Shop.findOne({
      where: {
        id: id
      },
      include: {
        model: Product,
        include: {
          model: OrderProduct,
          required: true,
          include: {
            model: Order,
            required: true,
            where: {
              isPaid: true
            }
          }
        }
      }
    })
    res.status(200).json(shop)
  } catch (err) {
    console.log(err)
  }
})


module.exports = router;
 