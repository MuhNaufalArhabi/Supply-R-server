// const ControllerJalurAtas = require("../controllers/controllerJalurAtas");
const BuyerController= require("../controllers/buyerController")
const {authenticateBuyer} = require("../middlewares/authenAtas");

const router = require("express").Router();

router.post("/login", BuyerController.buyerLogin);
router.post("/register", BuyerController.postBuyer);
router.get("/", BuyerController.getBuyers);
router.get("/:id", BuyerController.getOneBuyer);

router.use(authenticateBuyer);

router.delete("/", BuyerController.delBuyer);
router.put("/", BuyerController.editBuyer);

module.exports = router;
