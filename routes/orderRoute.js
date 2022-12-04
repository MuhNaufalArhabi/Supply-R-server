// const ControllerJalurAtas = require("../controllers/controllerJalurAtas");
const {
  authenticateBuyer,
  authDelBuyer,
} = require("../middlewares/authenAtas");
const OrderController = require("../controllers/orderController")
const router = require("express").Router();

// router.use(authenticateBuyer);

// can only accessed by authenticated token
router.get("/", OrderController.fetchBuyerOrder);
router.patch("/", OrderController.patchOrder);
router.post("/products", OrderController.postOrderProduct);
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
router.get("/testers",OrderController.testGetOrder)

module.exports = router;
