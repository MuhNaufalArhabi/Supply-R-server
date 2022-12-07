// const ControllerJalurAtas = require("../controllers/controllerJalurAtas");
const {
  authenticateBuyer,
  authDelBuyer,
} = require("../middlewares/authenAtas");
const OrderController = require("../controllers/orderController");
const router = require("express").Router();

router.use(authenticateBuyer);

// can only accessed by authenticated token
router.get("/", OrderController.fetchBuyerOrder);
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
// router.get("/testers",OrderController.testGetOrder)
// router.post("/testMid", OrderController.midTransToken);

module.exports = router;
