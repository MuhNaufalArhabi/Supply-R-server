const { Image } = require('../models');

class ImageController {
    static async getImageByProductId(req, res, next){
        try {
            const ProductId = req.params.productId
            const data = await Image.findAll({where: {ProductId}})
            if(!data) {
                throw {name: 'not_found'}
            }
            res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    }

    static async getImageByProductIdById(req, res, next){
        try {
            const {productId, id} = req.params
            const data = await Image.findOne({where: {ProductId: productId, id}})
        } catch (err) {
            next(err)
        }
    }
}