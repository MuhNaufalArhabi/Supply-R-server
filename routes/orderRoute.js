const ControllerJalurAtas = require("../controllers/controllerJalurAtas");
const {
  authenticateBuyer,
  authDelBuyer,
} = require("../middlewares/authenAtas");
const router = require("express").Router();

router.use(authenticateBuyer);

// can only accessed by authenticated token
router.get("/", ControllerJalurAtas.fetchBuyerOrder);
router.patch("/", ControllerJalurAtas.patchOrder);
router.post("/products", ControllerJalurAtas.postOrderProduct);
router.delete(
  "/products/:orderProductId",
  authDelBuyer,
  ControllerJalurAtas.delOrderProduct
);
router.patch(
  "/products/:orderProductId",
  authDelBuyer,
  ControllerJalurAtas.patchOrderProduct
);


module.exports = router;
