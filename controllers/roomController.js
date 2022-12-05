const {Room} = require('../models');

class RoomController {
    static async getAllRoomsByUserId(req, res, next) {
        try {
            const {id} = req.params;
            const rooms = await Room.findAll({
                where: {
                    BuyerId: id
                },
                include: ['Shop', 'Buyer']
            });
            res.status(200).json(rooms);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RoomController;