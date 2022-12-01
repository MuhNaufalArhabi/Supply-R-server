const router = require('express').Router();
const sellerRouter = require('./sellerRouter');
const shopRouter = require('./shopRouter');
const buyerRoute = require("./buyerRoute");
const productRouter = require('./productRouter');

router.use('/shops', shopRouter);
router.use('/sellers', sellerRouter);
router.use("/buyers", buyerRoute);
router.use('/products', productRouter);


module.exports = router;
