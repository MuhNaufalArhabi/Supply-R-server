const {
  authenticateBuyer,
  authDelBuyer,
} = require("../middlewares/authenAtas");
const OrderController = require("../controllers/orderController");
const router = require("express").Router();

router.post("/midTTrans", OrderController.patchOrderMidtrans);
router.use(authenticateBuyer);
// can only accessed by authenticated token
router.get("/", OrderController.fetchBuyerOrder);
router.get("/history", OrderController.fetchBuyerOrderHistory);
router.patch("/", OrderController.patchOrder);
router.post("/products", OrderController.postOrderProduct);
router.put("/products/bulk", OrderController.bulkUpdateOrderProducts);
router.delete(
  "/products/:orderProductId",
  authDelBuyer,
  OrderController.delOrderProduct
);
router.patch(
  "/products/:orderProductId",
  authDelBuyer,
  OrderController.patchOrderProduct
);

module.exports = router;
