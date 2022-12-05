const router = require("express").Router();
const RoomController = require("../controllers/roomController");

router.get("/:id", RoomController.getAllRoomsByUserId);

module.exports = router;