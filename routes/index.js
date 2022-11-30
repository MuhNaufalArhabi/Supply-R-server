const router = require('express').Router();
const shopRouter = require('./shopRouter');

router.use('/shops', shopRouter);

module.exports = router