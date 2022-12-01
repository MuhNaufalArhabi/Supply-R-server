const router = require('express').Router();
const SellerController = require('../controllers/sellerController');
const authentication = require('../middlewares/auth');

router.post('/register', SellerController.create);
router.post('/login', SellerController.login);
router.use(authentication);
router.get('/', SellerController.findAll);
router.get('/:id', SellerController.findOne);
router.put('/:id', SellerController.update);
router.delete('/:id', SellerController.delete);



module.exports = router