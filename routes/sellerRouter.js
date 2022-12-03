const router = require('express').Router();
const SellerController = require('../controllers/sellerController');
const authentication = require('../middlewares/auth');
const SosmedController = require('../controllers/sosmedController');

router.post('/register', SellerController.create);
router.post('/login', SellerController.login);
router.post('/google-login', SosmedController.googleLogin);
router.post('/facebook-login', SosmedController.facebookLogin);
router.post('/twitter-login', SosmedController.twitterLogin);
router.get('/', SellerController.findAll);
router.get('/:id', SellerController.findOne);
router.use(authentication);
router.put('/:id', SellerController.update);
router.delete('/:id', SellerController.delete);


module.exports = router