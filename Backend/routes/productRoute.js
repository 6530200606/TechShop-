import express from "express";
import * as productController from "../controllers/productController.js"

const router = express.Router()

router.get('/products', productController.getAllProduct)
router.get('/products/search/:id', productController.getSearchProduct)
router.get('/products/:id', productController.getProductById)
router.get('/products/brands/:id', productController.getProductByBrandId)
router.get('/products/types/:id', productController.getProductByTypeId)
router.post('/products', productController.postProduct)
router.put('/products/:id', productController.putProduct)
router.put('/products/decreaseProduct/:id',productController.decreaseProduct)
router.post('/products/delete/:id', productController.deleteProduct)
export default router