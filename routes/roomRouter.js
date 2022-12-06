const router = require("express").Router();
const RoomController = require("../controllers/roomController");

router.get("/:id", RoomController.getAllRoomsByUserId);
router.get("/chat/:id", RoomController.getMessageByRoomId);

module.exports = router;