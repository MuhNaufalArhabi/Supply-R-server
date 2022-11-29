const ControllerJalurAtas = require("../controllers/controllerJalurAtas");

const router = require("express").Router();

router.get("/", ControllerJalurAtas.getBuyers);
router.post("/", ControllerJalurAtas.postBuyer);
router.get("/:id", ControllerJalurAtas.getOneBuyer);
router.delete("/:id", ControllerJalurAtas.delBuyer);

module.exports = router;
