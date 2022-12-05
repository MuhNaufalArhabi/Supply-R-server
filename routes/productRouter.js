const router = require('express').Router();
const ProductController = require('../controllers/productController');
const authShop = require('../middlewares/authShop');

const multer = require('multer');

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
        cb(null, true);
    } else {
        cb(null, false)
    }
}

const upload = multer({ fileFilter:fileFilter })

router.get('/', ProductController.getAllProducts);
router.get('/search', ProductController.searchProduct);
router.get('/pagination', ProductController.getProductsPagination);
router.get('/:id', ProductController.getProductById);
router.get('/shop/:shopId', ProductController.getProductsByShop);
router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.get('/category/:categoryId/search', ProductController.searchProductByCategory);
router.use(authShop);
router.post('/', upload.array('image') ,ProductController.addProduct);
router.put('/:id', ProductController.editProduct);
router.delete('/:id', ProductController.deleteProduct);


module.exports = router;