import { Router } from 'express';
import { testController } from '../controllers/test.js';
import { checkoutController } from '../controllers/checkout.js';
import { storeController } from '../controllers/store.js';
import { productsController } from '../controllers/products.js';
const router = Router();

router.get('/test', testController.setCurrencies);
router.post('/checkout', checkoutController.doCheckout);
router.post('/store', storeController.createStore);
router.put('/store', storeController.enrollKeycard);
router.post('/product', productsController.createProducts);
router.get('/product', productsController.listen);

export default router;
