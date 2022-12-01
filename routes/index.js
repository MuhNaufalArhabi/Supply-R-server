const router = require('express').Router();
const sellerRouter = require('./sellerRouter');

router.use('/sellers', sellerRouter);

module.exports = router