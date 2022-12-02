const ControllerJalurAtas = require("../controllers/controllerJalurAtas");
const {authenticateBuyer} = require("../middlewares/authenAtas");

const router = require("express").Router();

router.post("/login", ControllerJalurAtas.buyerLogin);
router.post("/register", ControllerJalurAtas.postBuyer);
router.get("/", ControllerJalurAtas.getBuyers);
router.get("/:id", ControllerJalurAtas.getOneBuyer);

router.use(authenticateBuyer);

router.delete("/", ControllerJalurAtas.delBuyer);
router.put("/", ControllerJalurAtas.editBuyer);

module.exports = router;
