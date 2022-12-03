const router = require('express').Router();
const ShopController = require('../controllers/shopController');
const authentication = require('../middlewares/auth');

router.use(authentication)
router.get('/', ShopController.findAll)
router.get('/:id', ShopController.findOne)
router.post('/add', ShopController.create)
router.put('/update/:id', ShopController.update)
router.delete('/delete/:id', ShopController.delete)

module.exports = router