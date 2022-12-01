const router = require('express').Router();
const sellerRouter = require('./sellerRouter');
const shopRouter = require('./shopRouter');

router.use('/shops', shopRouter);
router.use('/sellers', sellerRouter);





module.exports = router