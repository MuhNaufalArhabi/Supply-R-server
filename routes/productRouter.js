const router = require('express').Router();
const ProductController = require('../controllers/productController');
const authShop = require('../middlewares/authShop');

const multer = require('multer');

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, '')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
        cb(null, true);
    } else {
        cb(null, false)
    }
}

const upload = multer({ fileFilter:fileFilter })

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.use(authShop);
router.post('/', upload.array('image') ,ProductController.addProduct);
router.put('/:id', ProductController.editProduct);
router.delete('/:id', ProductController.deleteProduct);


module.exports = router;