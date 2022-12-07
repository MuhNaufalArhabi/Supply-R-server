const router = require('express').Router();
const ShopController = require('../controllers/shopController');
const authentication = require('../middlewares/auth');

router.get('/', ShopController.findAll)
router.get('/:id', ShopController.findOne)
router.use(authentication)
router.get('/matriks-upfront/:id', ShopController.matriksUpfront)
router.get('/matriks-installment/:id', ShopController.matriksInstallment)
router.post('/add', ShopController.create)
router.put('/update/:id', ShopController.update)
router.delete('/delete/:id', ShopController.delete)

module.exports = router