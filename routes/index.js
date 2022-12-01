const router = require('express').Router();
const sellerRouter = require('./sellerRouter');
const shopRouter = require('./shopRouter');
const buyerRoute = require("./buyerRoute");

router.use('/shops', shopRouter);
router.use('/sellers', sellerRouter);
router.use("/buyers", buyerRoute);


module.exports = router;
