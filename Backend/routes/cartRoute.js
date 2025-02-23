import express from "express";
import * as cartController from "../controllers/cartController.js"

const router = express.Router()
router.post('/carts/addCart', cartController.postCart)
router.post('/carts/addcartdtl', cartController.postCartDtl)
router.get('/carts/getCartId/:id', cartController.getCartId)
router.get('/carts/getCart/:id', cartController.getCart)
router.get('/carts/getcartdtl/:id', cartController.getCartDtl)
router.put('/carts/updateCartDtl', cartController.putCartDtl);
router.delete('/carts/deleteCartDtl', cartController.delCartDtl);
router.delete('/carts/clearCart', cartController.clearCart);


export default router