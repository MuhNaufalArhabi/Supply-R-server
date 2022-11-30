const router = require('express').Router();
const ShopController = require('../controllers/shopController');

router.get('/', ShopController.findAll)
router.get('/:id', ShopController.findOne)
router.post('/', ShopController.create)
router.put('/:id', ShopController.update)
router.delete('/:id', ShopController.delete)

module.exports = router