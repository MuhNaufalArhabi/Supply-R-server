const router = require("express").Router();
const buyerRoute = require("./buyerRoute");

router.use("/buyers", buyerRoute);

module.exports = router;
