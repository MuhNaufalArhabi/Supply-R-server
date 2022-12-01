const ControllerJalurAtas = require("../controllers/controllerJalurAtas");
const {authenticateBuyer} = require("../middlewares/authenAtas");

const router = require("express").Router();

router.post("/login", ControllerJalurAtas.buyerLogin);
router.post("/register", ControllerJalurAtas.postBuyer);

// router.use(authenticateBuyer);

router.get("/", ControllerJalurAtas.getBuyers);
router.get("/:id", ControllerJalurAtas.getOneBuyer);
router.delete("/:id", ControllerJalurAtas.delBuyer);

module.exports = router;
