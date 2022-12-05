const {Room, Chat} = require('../models');

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

    static async getMessageByRoomId(req, res, next) {
        try {
            const {id} = req.params;
            const chat = await Chat.findAll({
                where: {
                    RoomId : id
                },
                order: [['createdAt', 'ASC']]
            
            });
            res.status(200).json(chat);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = RoomController;