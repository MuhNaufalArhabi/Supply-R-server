const router = require('express').Router();
const ProductController = require('../controllers/productController');
const authShop = require('../middlewares/authShop');

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.use(authShop);
router.post('/', ProductController.addProduct);
router.put('/:id', ProductController.editProduct);
router.delete('/:id', ProductController.deleteProduct);


module.exports = router;