const router = require("express").Router();
const sellerRouter = require("./sellerRouter");
const shopRouter = require("./shopRouter");
const buyerRoute = require("./buyerRoute");
const productRouter = require("./productRouter");
const orderRoute = require("./orderRoute");

router.use("/shops", shopRouter);
router.use("/sellers", sellerRouter);
router.use("/buyers", buyerRoute);
router.use("/products", productRouter);
router.use("/orders", orderRoute);

module.exports = router;
