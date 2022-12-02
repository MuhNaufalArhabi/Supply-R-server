const ControllerJalurAtas = require("../controllers/controllerJalurAtas");
const {authenticateBuyer} = require("../middlewares/authenAtas");

const router = require("express").Router();

router.post("/login", ControllerJalurAtas.buyerLogin);
router.post("/register", ControllerJalurAtas.postBuyer);
router.get("/", ControllerJalurAtas.getBuyers);
router.get("/:id", ControllerJalurAtas.getOneBuyer);

router.use(authenticateBuyer);

router.delete("/:id", ControllerJalurAtas.delBuyer);
router.put("/:id", ControllerJalurAtas.editBuyer);

module.exports = router;
